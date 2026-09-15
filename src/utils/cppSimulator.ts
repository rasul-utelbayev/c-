import { ExecutionResult, MemoryCell } from '../types';

export function simulateCppCode(code: string, stdinInputs: string[] = []): ExecutionResult {
  const errors: string[] = [];
  let output = '';
  let stepsCount = 0;
  let inputIdx = 0;
  const memory: MemoryCell[] = [];
  let baseAddress = 0x7ffd0000;

  // Basic syntax pre-checks
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      output: '',
      errors: ['Kiritilgan kod bo\'sh. Iltimos, C++ kodini yozing.'],
      stepsCount: 0,
      memory: [],
      exitCode: 1,
    };
  }

  // Check brackets balance
  let braceCount = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') braceCount++;
    if (code[i] === '}') braceCount--;
  }
  if (braceCount !== 0) {
    errors.push(
      braceCount > 0 
        ? "Sintaksis xatosi: Ochilgan jingalak qavs '{' yopilmagan!" 
        : "Sintaksis xatosi: Ortiqcha '}' jingalak qavs mavjud!"
    );
    return {
      output: '',
      errors,
      stepsCount: 0,
      memory: [],
      exitCode: 1,
    };
  }

  // Check for main function
  if (!code.includes('main')) {
    errors.push("Kompilyatsiya xatosi: 'int main()' funksiyasi topilmadi. Har bir C++ dasturi main() dan boshlanishi shart!");
    return {
      output: '',
      errors,
      stepsCount: 0,
      memory: [],
      exitCode: 1,
    };
  }

  // Check for nullptr dereference (Segfault easter egg)
  if (
    code.includes('nullptr') && 
    (code.match(/\*(\w+)\s*=\s*/g) || code.match(/cout\s*<<\s*\*(\w+)/g))
  ) {
    return {
      output: 'Dastur boshlandi...\nSegmentation fault (core dumped)\n[1]    1337 segmentation fault (core dumped)  ./dastur',
      errors: [
        "Dahshatli xatolik: SIGSEGV - Segmentation Fault (Xotira ruxsat xatosi)!",
        "Siz nullptr (nol manzil) ko'rsatayotgan xotiraga murojaat qildingiz yoki qiymat yozmoqchi bo'ldingiz.",
        "C++ da xotirani to'g'ridan to'g'ri boshqarasiz, shuning uchun operatsion tizim sizni zudlik bilan to'xtatdi!"
      ],
      stepsCount: 1,
      memory: [
        { address: '0x00000000', name: 'ptr', type: 'pointer', value: 'nullptr', pointsTo: '0x00000000', bytes: 8 }
      ],
      isSegFault: true,
      exitCode: 139,
    };
  }

  // Memory manager helper
  const getNextAddress = (bytes: number = 4) => {
    const addr = '0x' + baseAddress.toString(16);
    baseAddress += bytes;
    return addr;
  };

  const variables: Record<string, { type: string; value: any; address: string; pointsTo?: string }> = {};

  const syncMemory = () => {
    memory.length = 0;
    for (const [name, data] of Object.entries(variables)) {
      memory.push({
        address: data.address,
        name,
        type: data.type as any,
        value: data.value,
        pointsTo: data.pointsTo,
        bytes: data.type === 'pointer' ? 8 : data.type === 'double' ? 8 : data.type === 'char' || data.type === 'bool' ? 1 : 4,
      });
    }
  };

  // Evaluate simple expression
  const evaluateExpr = (expr: string): any => {
    let cleaned = expr.trim();
    if (!cleaned) return 0;

    // String literal
    if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
      return cleaned.slice(1, -1);
    }

    // Bool literals
    if (cleaned === 'true') return true;
    if (cleaned === 'false') return false;

    // Pointer dereference: *p
    if (cleaned.startsWith('*')) {
      const ptrName = cleaned.slice(1).trim();
      if (variables[ptrName] && variables[ptrName].type === 'pointer') {
        const targetAddr = variables[ptrName].pointsTo;
        const target = Object.values(variables).find(v => v.address === targetAddr);
        return target ? target.value : 0;
      }
    }

    // Address-of: &a
    if (cleaned.startsWith('&')) {
      const varName = cleaned.slice(1).trim();
      if (variables[varName]) {
        return variables[varName].address;
      }
    }

    // Array indexing: arr[0]
    const arrayMatch = cleaned.match(/^([a-zA-Z_]\w*)\[(.+)\]$/);
    if (arrayMatch) {
      const arrName = arrayMatch[1];
      const idx = Number(evaluateExpr(arrayMatch[2]));
      const key = `${arrName}[${idx}]`;
      if (variables[key] !== undefined) {
        return variables[key].value;
      } else {
        // Out of bounds simulation
        return Math.floor(Math.random() * -999999999); // Garbage value
      }
    }

    // If it's a known variable
    if (variables[cleaned] !== undefined) {
      return variables[cleaned].value;
    }

    // Number literal
    if (!isNaN(Number(cleaned))) {
      return Number(cleaned);
    }

    // Basic arithmetic evaluation with safe variable substitution
    let safeFormula = cleaned;
    // Replace variable names with their values
    for (const [vName, vData] of Object.entries(variables)) {
      const regex = new RegExp(`\\b${vName}\\b`, 'g');
      if (typeof vData.value === 'string') {
        // don't substitute string into math unless string concat
        safeFormula = safeFormula.replace(regex, JSON.stringify(vData.value));
      } else {
        safeFormula = safeFormula.replace(regex, String(vData.value));
      }
    }

    try {
      // Clean up modulo % and power if any
      // Safe math evaluate
      const res = Function(`"use strict"; return (${safeFormula})`)();
      return res;
    } catch {
      return cleaned;
    }
  };

  // Extract main block content
  const mainMatch = code.match(/int\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
  const codeBody = mainMatch ? mainMatch[1] : code;

  // Split lines while preserving blocks
  const rawLines = codeBody.split('\n');

  // Infinite loop protection
  const MAX_STEPS = 30000;

  // Simple interpreter loop
  let i = 0;
  const loopStack: { type: 'for' | 'while'; cond: string; bodyLines: string[]; stepExpr?: string; startLine: number }[] = [];

  const executeStatement = (stmt: string): boolean => {
    stepsCount++;
    if (stepsCount > MAX_STEPS) {
      throw new Error('INFINITE_LOOP');
    }

    const line = stmt.trim();
    if (!line || line.startsWith('//') || line.startsWith('/*')) return true;

    // Check for accidental assignment in if statement: if (a = 5)
    const badIfMatch = line.match(/if\s*\(\s*([a-zA-Z_]\w*)\s*=\s*([^=][^)]*)\)/);
    if (badIfMatch) {
      output += `\n[OGOHLANTIRISH]: 'if (${badIfMatch[1]} = ${badIfMatch[2].trim()})' — siz '=' (o'zlashtirish) yozdingiz! C++ da solishtirish '==' bo'ladi.\n`;
    }

    // 1. cout << ... << endl;
    if (line.startsWith('cout') || line.startsWith('std::cout')) {
      const rest = line.replace(/^(std::)?cout\s*<<\s*/, '').replace(/;$/, '');
      const parts = splitCoutParts(rest);

      for (const part of parts) {
        const p = part.trim();
        if (p === 'endl' || p === 'std::endl' || p === '"\\n"') {
          output += '\n';
        } else if (p.startsWith('"') && p.endsWith('"')) {
          output += p.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        } else {
          const val = evaluateExpr(p);
          output += val !== undefined ? String(val) : '';
        }
      }
      return true;
    }

    // 2. cin >> a >> b;
    if (line.startsWith('cin') || line.startsWith('std::cin')) {
      const rest = line.replace(/^(std::)?cin\s*>>\s*/, '').replace(/;$/, '');
      const varNames = rest.split('>>').map(s => s.trim());
      for (const vName of varNames) {
        const val = inputIdx < stdinInputs.length ? stdinInputs[inputIdx++] : '0';
        if (variables[vName]) {
          if (variables[vName].type === 'int') variables[vName].value = parseInt(val, 10) || 0;
          else if (variables[vName].type === 'double') variables[vName].value = parseFloat(val) || 0.0;
          else variables[vName].value = val;
        } else {
          // create implicit
          variables[vName] = {
            type: 'int',
            value: parseInt(val, 10) || 0,
            address: getNextAddress(4),
          };
        }
      }
      syncMemory();
      return true;
    }

    // 3. Pointer declaration: int* p = &a; or int *p = &a;
    const ptrDeclMatch = line.match(/^(int|double|string|char)\s*\*\s*([a-zA-Z_]\w*)\s*=\s*&([a-zA-Z_]\w*)\s*;?$/);
    if (ptrDeclMatch) {
      const [, , ptrName, targetName] = ptrDeclMatch;
      const targetVar = variables[targetName];
      const targetAddr = targetVar ? targetVar.address : getNextAddress(4);
      variables[ptrName] = {
        type: 'pointer',
        value: targetAddr,
        pointsTo: targetAddr,
        address: getNextAddress(8),
      };
      syncMemory();
      return true;
    }

    // 4. Pointer dereference assignment: *p = 50;
    const derefAssignMatch = line.match(/^\*([a-zA-Z_]\w*)\s*=\s*(.+);?$/);
    if (derefAssignMatch) {
      const [, ptrName, expr] = derefAssignMatch;
      const val = evaluateExpr(expr.replace(/;$/, ''));
      const ptrVar = variables[ptrName];
      if (ptrVar && ptrVar.type === 'pointer' && ptrVar.pointsTo) {
        const target = Object.values(variables).find(v => v.address === ptrVar.pointsTo);
        if (target) {
          target.value = val;
        }
      }
      syncMemory();
      return true;
    }

    // 5. Array declaration: int arr[3] = {1, 2, 3}; or int arr[5];
    const arrayInitMatch = line.match(/^(int|double|string|char|bool)\s+([a-zA-Z_]\w*)\[(\d+)\]\s*=\s*\{([^}]*)\}\s*;?$/);
    if (arrayInitMatch) {
      const [, type, arrName, sizeStr, itemsStr] = arrayInitMatch;
      const size = parseInt(sizeStr, 10);
      const items = itemsStr.split(',').map(s => s.trim()).filter(Boolean);
      for (let k = 0; k < size; k++) {
        const val = k < items.length ? evaluateExpr(items[k]) : 0;
        variables[`${arrName}[${k}]`] = {
          type,
          value: val,
          address: getNextAddress(4),
        };
      }
      syncMemory();
      return true;
    }

    // 6. Array item assignment: arr[0] = 10;
    const arrayItemAssignMatch = line.match(/^([a-zA-Z_]\w*)\[([^\]]+)\]\s*=\s*(.+);?$/);
    if (arrayItemAssignMatch) {
      const [, arrName, idxExpr, valExpr] = arrayItemAssignMatch;
      const idx = evaluateExpr(idxExpr);
      const val = evaluateExpr(valExpr.replace(/;$/, ''));
      const key = `${arrName}[${idx}]`;
      if (variables[key]) {
        variables[key].value = val;
      } else {
        variables[key] = {
          type: 'int',
          value: val,
          address: getNextAddress(4),
        };
      }
      syncMemory();
      return true;
    }

    // 7. Variable declaration: int a = 10; or int a;
    const declMatch = line.match(/^(int|double|float|string|char|bool)\s+([a-zA-Z_]\w*)\s*(=\s*([^;]+))?\s*;?$/);
    if (declMatch) {
      const [, type, name, , expr] = declMatch;
      let val: any = 0;
      if (expr) {
        val = evaluateExpr(expr);
      } else {
        // default values
        if (type === 'string') val = "";
        else if (type === 'bool') val = false;
        else if (type === 'char') val = '\0';
        else val = 0;
      }
      variables[name] = {
        type,
        value: val,
        address: getNextAddress(type === 'double' ? 8 : type === 'char' || type === 'bool' ? 1 : 4),
      };
      syncMemory();
      return true;
    }

    // 8. Re-assignment or increments: a = 20; a++; ++a; a += 5;
    if (line.match(/^[a-zA-Z_]\w*\+\+;?$/)) {
      const vName = line.replace('++', '').replace(';', '').trim();
      if (variables[vName]) variables[vName].value++;
      syncMemory();
      return true;
    }
    if (line.match(/^\+\+[a-zA-Z_]\w*;?$/)) {
      const vName = line.replace('++', '').replace(';', '').trim();
      if (variables[vName]) variables[vName].value++;
      syncMemory();
      return true;
    }
    if (line.match(/^[a-zA-Z_]\w*\-\-;?$/)) {
      const vName = line.replace('--', '').replace(';', '').trim();
      if (variables[vName]) variables[vName].value--;
      syncMemory();
      return true;
    }

    const compoundMatch = line.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=\/)\s*(.+);?$/);
    if (compoundMatch) {
      const [, vName, op, expr] = compoundMatch;
      const rightVal = evaluateExpr(expr.replace(/;$/, ''));
      if (variables[vName]) {
        if (op === '+=') variables[vName].value += rightVal;
        if (op === '-=') variables[vName].value -= rightVal;
        if (op === '*=') variables[vName].value *= rightVal;
      }
      syncMemory();
      return true;
    }

    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+);?$/);
    if (assignMatch) {
      const [, vName, expr] = assignMatch;
      const val = evaluateExpr(expr.replace(/;$/, ''));
      if (variables[vName]) {
        variables[vName].value = val;
      } else {
        variables[vName] = {
          type: typeof val === 'number' ? 'int' : typeof val === 'string' ? 'string' : 'bool',
          value: val,
          address: getNextAddress(4),
        };
      }
      syncMemory();
      return true;
    }

    // Return statement
    if (line.startsWith('return')) {
      return false; // Stop execution
    }

    return true;
  };

  try {
    // Process lines and simple loops / conditions
    let lineIdx = 0;
    while (lineIdx < rawLines.length) {
      const raw = rawLines[lineIdx].trim();
      lineIdx++;
      if (!raw || raw === '{' || raw === '}' || raw.startsWith('//') || raw.startsWith('#') || raw.startsWith('using namespace')) {
        continue;
      }

      // Check for 'for' loop
      const forMatch = raw.match(/^for\s*\(([^;]+);([^;]+);([^)]+)\)\s*\{?/);
      if (forMatch) {
        const [, initStmt, condExpr, stepStmt] = forMatch;
        executeStatement(initStmt);

        // Gather loop body lines until matching brace
        const bodyLines: string[] = [];
        let innerBrace = raw.includes('{') ? 1 : 0;
        
        while (lineIdx < rawLines.length) {
          const bLine = rawLines[lineIdx];
          lineIdx++;
          if (bLine.includes('{')) innerBrace++;
          if (bLine.includes('}')) {
            innerBrace--;
            if (innerBrace <= 0) break;
          }
          bodyLines.push(bLine);
        }

        // Run the for loop
        let loopCount = 0;
        while (Boolean(evaluateExpr(condExpr))) {
          loopCount++;
          if (loopCount > 10000) throw new Error('INFINITE_LOOP');
          for (const bStmt of bodyLines) {
            executeStatement(bStmt);
          }
          executeStatement(stepStmt);
        }
        continue;
      }

      // Check for 'while' loop
      const whileMatch = raw.match(/^while\s*\(([^)]+)\)\s*\{?/);
      if (whileMatch) {
        const condExpr = whileMatch[1];
        const bodyLines: string[] = [];
        let innerBrace = raw.includes('{') ? 1 : 0;
        while (lineIdx < rawLines.length) {
          const bLine = rawLines[lineIdx];
          lineIdx++;
          if (bLine.includes('{')) innerBrace++;
          if (bLine.includes('}')) {
            innerBrace--;
            if (innerBrace <= 0) break;
          }
          bodyLines.push(bLine);
        }

        let loopCount = 0;
        while (Boolean(evaluateExpr(condExpr))) {
          loopCount++;
          if (loopCount > 10000) throw new Error('INFINITE_LOOP');
          for (const bStmt of bodyLines) {
            executeStatement(bStmt);
          }
        }
        continue;
      }

      // Check for 'if' statement
      const ifMatch = raw.match(/^if\s*\(([^)]+)\)\s*\{?/);
      if (ifMatch) {
        const condExpr = ifMatch[1];
        const condResult = Boolean(evaluateExpr(condExpr));

        const ifBodyLines: string[] = [];
        let innerBrace = raw.includes('{') ? 1 : 0;
        while (lineIdx < rawLines.length) {
          const bLine = rawLines[lineIdx];
          lineIdx++;
          if (bLine.includes('{')) innerBrace++;
          if (bLine.includes('}')) {
            innerBrace--;
            if (innerBrace <= 0) break;
          }
          ifBodyLines.push(bLine);
        }

        // Check for else
        let hasElse = false;
        const elseBodyLines: string[] = [];
        if (lineIdx < rawLines.length && rawLines[lineIdx].trim().startsWith('else')) {
          hasElse = true;
          const elseHeader = rawLines[lineIdx].trim();
          lineIdx++;
          let elseBrace = elseHeader.includes('{') ? 1 : 0;
          while (lineIdx < rawLines.length) {
            const eLine = rawLines[lineIdx];
            lineIdx++;
            if (eLine.includes('{')) elseBrace++;
            if (eLine.includes('}')) {
              elseBrace--;
              if (elseBrace <= 0) break;
            }
            elseBodyLines.push(eLine);
          }
        }

        if (condResult) {
          for (const bStmt of ifBodyLines) {
            executeStatement(bStmt);
          }
        } else if (hasElse) {
          for (const eStmt of elseBodyLines) {
            executeStatement(eStmt);
          }
        }
        continue;
      }

      // Single statement
      const shouldContinue = executeStatement(raw);
      if (!shouldContinue) break;
    }
  } catch (err: any) {
    if (err.message === 'INFINITE_LOOP') {
      return {
        output: output + '\n\n[XATOLIK]: Cheksiz sikl (Infinite loop) yuz berdi!\nDastur 10,000 martadan ortiq aylandi. Kompyuter muzlab qolmasligi uchun favqulodda to\'xtatildi!',
        errors: [
          'Cheksiz sikl aniqlandi: while yoki for siklingizning to\'xtash sharti hech qachon false bo\'lmayapti.',
          'Maslahat: Sikl ichidagi o\'zgaruvchi oshirilayotganini (i++) yoki shart to\'g\'riligini tekshiring!'
        ],
        stepsCount: 10000,
        memory,
        isInfiniteLoop: true,
        exitCode: 137,
      };
    } else {
      errors.push(`Ijro xatosi: ${err.message}`);
    }
  }

  syncMemory();

  return {
    output: output || '(Konsolga hech qanday ma\'lumot chiqarilmadi. "cout" ishlatganingizga ishonch hosil qiling)',
    errors,
    stepsCount,
    memory,
    exitCode: errors.length > 0 ? 1 : 0,
  };
}

function splitCoutParts(rest: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inString = false;
  let quoteChar = '';

  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if ((ch === '"' || ch === "'") && (i === 0 || rest[i - 1] !== '\\')) {
      if (!inString) {
        inString = true;
        quoteChar = ch;
      } else if (quoteChar === ch) {
        inString = false;
      }
    }

    if (!inString && ch === '<' && rest[i + 1] === '<') {
      if (current.trim()) parts.push(current.trim());
      current = '';
      i++; // Skip second '<'
      continue;
    }

    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}
