/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as o from '../output/output_ast';
import { Identifiers as R3 } from './r3_identifiers';
import { jitOnlyGuardedExpression, mapToMapExpression } from './util';
/**
 * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
 */
export function compileNgModule(meta) {
    const { internalType, type: moduleType, bootstrap, declarations, imports, exports, schemas, containsForwardDecls, emitInline, id } = meta;
    const additionalStatements = [];
    const definitionMap = { type: internalType };
    // Only generate the keys in the metadata if the arrays have values.
    if (bootstrap.length) {
        definitionMap.bootstrap = refsToArray(bootstrap, containsForwardDecls);
    }
    // If requested to emit scope information inline, pass the declarations, imports and exports to
    // the `ɵɵdefineNgModule` call. The JIT compilation uses this.
    if (emitInline) {
        if (declarations.length) {
            definitionMap.declarations = refsToArray(declarations, containsForwardDecls);
        }
        if (imports.length) {
            definitionMap.imports = refsToArray(imports, containsForwardDecls);
        }
        if (exports.length) {
            definitionMap.exports = refsToArray(exports, containsForwardDecls);
        }
    }
    // If not emitting inline, the scope information is not passed into `ɵɵdefineNgModule` as it would
    // prevent tree-shaking of the declarations, imports and exports references.
    else {
        const setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
        if (setNgModuleScopeCall !== null) {
            additionalStatements.push(setNgModuleScopeCall);
        }
    }
    if (schemas && schemas.length) {
        definitionMap.schemas = o.literalArr(schemas.map(ref => ref.value));
    }
    if (id) {
        definitionMap.id = id;
    }
    const expression = o.importExpr(R3.defineNgModule).callFn([mapToMapExpression(definitionMap)]);
    const type = new o.ExpressionType(o.importExpr(R3.NgModuleDefWithMeta, [
        new o.ExpressionType(moduleType.type), tupleTypeOf(declarations), tupleTypeOf(imports),
        tupleTypeOf(exports)
    ]));
    return { expression, type, additionalStatements };
}
/**
 * Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
 * transitive module scope can be computed during runtime in JIT mode. This call is marked pure
 * such that the references to declarations, imports and exports may be elided causing these
 * symbols to become tree-shakeable.
 */
function generateSetNgModuleScopeCall(meta) {
    const { adjacentType: moduleType, declarations, imports, exports, containsForwardDecls } = meta;
    const scopeMap = {};
    if (declarations.length) {
        scopeMap.declarations = refsToArray(declarations, containsForwardDecls);
    }
    if (imports.length) {
        scopeMap.imports = refsToArray(imports, containsForwardDecls);
    }
    if (exports.length) {
        scopeMap.exports = refsToArray(exports, containsForwardDecls);
    }
    if (Object.keys(scopeMap).length === 0) {
        return null;
    }
    // setNgModuleScope(...)
    const fnCall = new o.InvokeFunctionExpr(
    /* fn */ o.importExpr(R3.setNgModuleScope), 
    /* args */ [moduleType, mapToMapExpression(scopeMap)]);
    // (ngJitMode guard) && setNgModuleScope(...)
    const guardedCall = jitOnlyGuardedExpression(fnCall);
    // function() { (ngJitMode guard) && setNgModuleScope(...); }
    const iife = new o.FunctionExpr(
    /* params */ [], 
    /* statements */ [guardedCall.toStmt()]);
    // (function() { (ngJitMode guard) && setNgModuleScope(...); })()
    const iifeCall = new o.InvokeFunctionExpr(
    /* fn */ iife, 
    /* args */ []);
    return iifeCall.toStmt();
}
export function compileInjector(meta) {
    const definitionMap = {};
    if (meta.providers !== null) {
        definitionMap.providers = meta.providers;
    }
    if (meta.imports.length > 0) {
        definitionMap.imports = o.literalArr(meta.imports);
    }
    const expression = o.importExpr(R3.defineInjector).callFn([mapToMapExpression(definitionMap)]);
    const type = new o.ExpressionType(o.importExpr(R3.InjectorDef, [new o.ExpressionType(meta.type.type)]));
    return { expression, type };
}
function tupleTypeOf(exp) {
    const types = exp.map(ref => o.typeofExpr(ref.type));
    return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
}
function refsToArray(refs, shouldForwardDeclare) {
    const values = o.literalArr(refs.map(ref => ref.value));
    return shouldForwardDeclare ? o.fn([], [new o.ReturnStatement(values)]) : values;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfbW9kdWxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sS0FBSyxDQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHMUMsT0FBTyxFQUFDLFdBQVcsSUFBSSxFQUFFLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNuRCxPQUFPLEVBQUMsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQWMsTUFBTSxRQUFRLENBQUM7QUE0RWpGOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUF3QjtJQUN0RCxNQUFNLEVBQ0osWUFBWSxFQUNaLElBQUksRUFBRSxVQUFVLEVBQ2hCLFNBQVMsRUFDVCxZQUFZLEVBQ1osT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1Asb0JBQW9CLEVBQ3BCLFVBQVUsRUFDVixFQUFFLEVBQ0gsR0FBRyxJQUFJLENBQUM7SUFFVCxNQUFNLG9CQUFvQixHQUFrQixFQUFFLENBQUM7SUFDL0MsTUFBTSxhQUFhLEdBQUcsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQVF4QyxDQUFDO0lBRUYsb0VBQW9FO0lBQ3BFLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTtRQUNwQixhQUFhLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztLQUN4RTtJQUVELCtGQUErRjtJQUMvRiw4REFBOEQ7SUFDOUQsSUFBSSxVQUFVLEVBQUU7UUFDZCxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDdkIsYUFBYSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7U0FDOUU7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsYUFB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QUNyQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsSUFBbUIsRUFBRSxvQkFBNkI7SUFDckUsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEQsT0FBTyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDbkYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcblxuaW1wb3J0IHtSM0RlcGVuZGVuY3lNZXRhZGF0YSwgUjNGYWN0b3J5Rm59IGZyb20gJy4vcjNfZmFjdG9yeSc7XG5pbXBvcnQge0lkZW50aWZpZXJzIGFzIFIzfSBmcm9tICcuL3IzX2lkZW50aWZpZXJzJztcbmltcG9ydCB7aml0T25seUd1YXJkZWRFeHByZXNzaW9uLCBtYXBUb01hcEV4cHJlc3Npb24sIFIzUmVmZXJlbmNlfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFIzTmdNb2R1bGVEZWYge1xuICBleHByZXNzaW9uOiBvLkV4cHJlc3Npb247XG4gIHR5cGU6IG8uVHlwZTtcbiAgYWRkaXRpb25hbFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W107XG59XG5cbi8qKlxuICogTWV0YWRhdGEgcmVxdWlyZWQgYnkgdGhlIG1vZHVsZSBjb21waWxlciB0byBnZW5lcmF0ZSBhIG1vZHVsZSBkZWYgKGDJtW1vZGApIGZvciBhIHR5cGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUjNOZ01vZHVsZU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBtb2R1bGUgdHlwZSBiZWluZyBjb21waWxlZC5cbiAgICovXG4gIHR5cGU6IFIzUmVmZXJlbmNlO1xuXG4gIC8qKlxuICAgKiBBbiBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgbW9kdWxlIHR5cGUgYmVpbmcgY29tcGlsZWQsIGludGVuZGVkIGZvciB1c2Ugd2l0aGluIGEgY2xhc3NcbiAgICogZGVmaW5pdGlvbiBpdHNlbGYuXG4gICAqXG4gICAqIFRoaXMgY2FuIGRpZmZlciBmcm9tIHRoZSBvdXRlciBgdHlwZWAgaWYgdGhlIGNsYXNzIGlzIGJlaW5nIGNvbXBpbGVkIGJ5IG5nY2MgYW5kIGlzIGluc2lkZVxuICAgKiBhbiBJSUZFIHN0cnVjdHVyZSB0aGF0IHVzZXMgYSBkaWZmZXJlbnQgbmFtZSBpbnRlcm5hbGx5LlxuICAgKi9cbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gaW50ZW5kZWQgZm9yIHVzZSBieSBzdGF0ZW1lbnRzIHRoYXQgYXJlIGFkamFjZW50IChpLmUuIHRpZ2h0bHkgY291cGxlZCkgdG8gYnV0XG4gICAqIG5vdCBpbnRlcm5hbCB0byBhIGNsYXNzIGRlZmluaXRpb24uXG4gICAqXG4gICAqIFRoaXMgY2FuIGRpZmZlciBmcm9tIHRoZSBvdXRlciBgdHlwZWAgaWYgdGhlIGNsYXNzIGlzIGJlaW5nIGNvbXBpbGVkIGJ5IG5nY2MgYW5kIGlzIGluc2lkZVxuICAgKiBhbiBJSUZFIHN0cnVjdHVyZSB0aGF0IHVzZXMgYSBkaWZmZXJlbnQgbmFtZSBpbnRlcm5hbGx5LlxuICAgKi9cbiAgYWRqYWNlbnRUeXBlOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHJlcHJlc2VudGluZyB0aGUgYm9vdHN0cmFwIGNvbXBvbmVudHMgc3BlY2lmaWVkIGJ5IHRoZSBtb2R1bGUuXG4gICAqL1xuICBib290c3RyYXA6IFIzUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHJlcHJlc2VudGluZyB0aGUgZGlyZWN0aXZlcyBhbmQgcGlwZXMgZGVjbGFyZWQgYnkgdGhlIG1vZHVsZS5cbiAgICovXG4gIGRlY2xhcmF0aW9uczogUjNSZWZlcmVuY2VbXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBpbXBvcnRzIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBpbXBvcnRzOiBSM1JlZmVyZW5jZVtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBleHByZXNzaW9ucyByZXByZXNlbnRpbmcgdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGV4cG9ydHM6IFIzUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW1pdCB0aGUgc2VsZWN0b3Igc2NvcGUgdmFsdWVzIChkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGV4cG9ydHMpIGlubGluZSBpbnRvIHRoZVxuICAgKiBtb2R1bGUgZGVmaW5pdGlvbiwgb3IgdG8gZ2VuZXJhdGUgYWRkaXRpb25hbCBzdGF0ZW1lbnRzIHdoaWNoIHBhdGNoIHRoZW0gb24uIElubGluZSBlbWlzc2lvblxuICAgKiBkb2VzIG5vdCBhbGxvdyBjb21wb25lbnRzIHRvIGJlIHRyZWUtc2hha2VuLCBidXQgaXMgdXNlZnVsIGZvciBKSVQgbW9kZS5cbiAgICovXG4gIGVtaXRJbmxpbmU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZ2VuZXJhdGUgY2xvc3VyZSB3cmFwcGVycyBmb3IgYm9vdHN0cmFwLCBkZWNsYXJhdGlvbnMsIGltcG9ydHMsIGFuZCBleHBvcnRzLlxuICAgKi9cbiAgY29udGFpbnNGb3J3YXJkRGVjbHM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzZXQgb2Ygc2NoZW1hcyB0aGF0IGRlY2xhcmUgZWxlbWVudHMgdG8gYmUgYWxsb3dlZCBpbiB0aGUgTmdNb2R1bGUuXG4gICAqL1xuICBzY2hlbWFzOiBSM1JlZmVyZW5jZVtdfG51bGw7XG5cbiAgLyoqIFVuaXF1ZSBJRCBvciBleHByZXNzaW9uIHJlcHJlc2VudGluZyB0aGUgdW5pcXVlIElEIG9mIGFuIE5nTW9kdWxlLiAqL1xuICBpZDogby5FeHByZXNzaW9ufG51bGw7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGFuIGBSM05nTW9kdWxlRGVmYCBmb3IgdGhlIGdpdmVuIGBSM05nTW9kdWxlTWV0YWRhdGFgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZU5nTW9kdWxlKG1ldGE6IFIzTmdNb2R1bGVNZXRhZGF0YSk6IFIzTmdNb2R1bGVEZWYge1xuICBjb25zdCB7XG4gICAgaW50ZXJuYWxUeXBlLFxuICAgIHR5cGU6IG1vZHVsZVR5cGUsXG4gICAgYm9vdHN0cmFwLFxuICAgIGRlY2xhcmF0aW9ucyxcbiAgICBpbXBvcnRzLFxuICAgIGV4cG9ydHMsXG4gICAgc2NoZW1hcyxcbiAgICBjb250YWluc0ZvcndhcmREZWNscyxcbiAgICBlbWl0SW5saW5lLFxuICAgIGlkXG4gIH0gPSBtZXRhO1xuXG4gIGNvbnN0IGFkZGl0aW9uYWxTdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdID0gW107XG4gIGNvbnN0IGRlZmluaXRpb25NYXAgPSB7dHlwZTogaW50ZXJuYWxUeXBlfSBhcyB7XG4gICAgdHlwZTogby5FeHByZXNzaW9uLFxuICAgIGJvb3RzdHJhcDogby5FeHByZXNzaW9uLFxuICAgIGRlY2xhcmF0aW9uczogby5FeHByZXNzaW9uLFxuICAgIGltcG9ydHM6IG8uRXhwcmVzc2lvbixcbiAgICBleHBvcnRzOiBvLkV4cHJlc3Npb24sXG4gICAgc2NoZW1hczogby5MaXRlcmFsQXJyYXlFeHByLFxuICAgIGlkOiBvLkV4cHJlc3Npb25cbiAgfTtcblxuICAvLyBPbmx5IGdlbmVyYXRlIHRoZSBrZXlzIGluIHRoZSBtZXRhZGF0YSBpZiB0aGUgYXJyYXlzIGhhdmUgdmFsdWVzLlxuICBpZiAoYm9vdHN0cmFwLmxlbmd0aCkge1xuICAgIGRlZmluaXRpb25NYXAuYm9vdHN0cmFwID0gcmVmc1RvQXJyYXkoYm9vdHN0cmFwLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gIH1cblxuICAvLyBJZiByZXF1ZXN0ZWQgdG8gZW1pdCBzY29wZSBpbmZvcm1hdGlvbiBpbmxpbmUsIHBhc3MgdGhlIGRlY2xhcmF0aW9ucywgaW1wb3J0cyBhbmQgZXhwb3J0cyB0b1xuICAvLyB0aGUgYMm1ybVkZWZpbmVOZ01vZHVsZWAgY2FsbC4gVGhlIEpJVCBjb21waWxhdGlvbiB1c2VzIHRoaXMuXG4gIGlmIChlbWl0SW5saW5lKSB7XG4gICAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGRlZmluaXRpb25NYXAuZGVjbGFyYXRpb25zID0gcmVmc1RvQXJyYXkoZGVjbGFyYXRpb25zLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuXG4gICAgaWYgKGltcG9ydHMubGVuZ3RoKSB7XG4gICAgICBkZWZpbml0aW9uTWFwLmltcG9ydHMgPSByZWZzVG9BcnJheShpbXBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuXG4gICAgaWYgKGV4cG9ydHMubGVuZ3RoKSB7XG4gICAgICBkZWZpbml0aW9uTWFwLmV4cG9ydHMgPSByZWZzVG9BcnJheShleHBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgbm90IGVtaXR0aW5nIGlubGluZSwgdGhlIHNjb3BlIGluZm9ybWF0aW9uIGlzIG5vdCBwYXNzZWQgaW50byBgybXJtWRlZmluZU5nTW9kdWxlYCBhcyBpdCB3b3VsZFxuICAvLyBwcmV2ZW50IHRyZWUtc2hha2luZyBvZiB0aGUgZGVjbGFyYXRpb25zLCBpbXBvcnRzIGFuZCBleHBvcnRzIHJlZmVyZW5jZXMuXG4gIGVsc2Uge1xuICAgIGNvbnN0IHNldE5nTW9kdWxlU2NvcGVDYWxsID0gZ2VuZXJhdGVTZXROZ01vZHVsZVNjb3BlQ2FsbChtZXRhKTtcbiAgICBpZiAoc2V0TmdNb2R1bGVTY29wZUNhbGwgIT09IG51bGwpIHtcbiAgICAgIGFkZGl0aW9uYWxTdGF0ZW1lbnRzLnB1c2goc2V0TmdNb2R1bGVTY29wZUNhbGwpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzY2hlbWFzICYmIHNjaGVtYXMubGVuZ3RoKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5zY2hlbWFzID0gby5saXRlcmFsQXJyKHNjaGVtYXMubWFwKHJlZiA9PiByZWYudmFsdWUpKTtcbiAgfVxuXG4gIGlmIChpZCkge1xuICAgIGRlZmluaXRpb25NYXAuaWQgPSBpZDtcbiAgfVxuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lTmdNb2R1bGUpLmNhbGxGbihbbWFwVG9NYXBFeHByZXNzaW9uKGRlZmluaXRpb25NYXApXSk7XG4gIGNvbnN0IHR5cGUgPSBuZXcgby5FeHByZXNzaW9uVHlwZShvLmltcG9ydEV4cHIoUjMuTmdNb2R1bGVEZWZXaXRoTWV0YSwgW1xuICAgIG5ldyBvLkV4cHJlc3Npb25UeXBlKG1vZHVsZVR5cGUudHlwZSksIHR1cGxlVHlwZU9mKGRlY2xhcmF0aW9ucyksIHR1cGxlVHlwZU9mKGltcG9ydHMpLFxuICAgIHR1cGxlVHlwZU9mKGV4cG9ydHMpXG4gIF0pKTtcblxuXG4gIHJldHVybiB7ZXhwcmVzc2lvbiwgdHlwZSwgYWRkaXRpb25hbFN0YXRlbWVudHN9O1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGZ1bmN0aW9uIGNhbGwgdG8gYMm1ybVzZXROZ01vZHVsZVNjb3BlYCB3aXRoIGFsbCBuZWNlc3NhcnkgaW5mb3JtYXRpb24gc28gdGhhdCB0aGVcbiAqIHRyYW5zaXRpdmUgbW9kdWxlIHNjb3BlIGNhbiBiZSBjb21wdXRlZCBkdXJpbmcgcnVudGltZSBpbiBKSVQgbW9kZS4gVGhpcyBjYWxsIGlzIG1hcmtlZCBwdXJlXG4gKiBzdWNoIHRoYXQgdGhlIHJlZmVyZW5jZXMgdG8gZGVjbGFyYXRpb25zLCBpbXBvcnRzIGFuZCBleHBvcnRzIG1heSBiZSBlbGlkZWQgY2F1c2luZyB0aGVzZVxuICogc3ltYm9scyB0byBiZWNvbWUgdHJlZS1zaGFrZWFibGUuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlU2V0TmdNb2R1bGVTY29wZUNhbGwobWV0YTogUjNOZ01vZHVsZU1ldGFkYXRhKTogby5TdGF0ZW1lbnR8bnVsbCB7XG4gIGNvbnN0IHthZGphY2VudFR5cGU6IG1vZHVsZVR5cGUsIGRlY2xhcmF0aW9ucywgaW1wb3J0cywgZXhwb3J0cywgY29udGFpbnNGb3J3YXJkRGVjbHN9ID0gbWV0YTtcblxuICBjb25zdCBzY29wZU1hcCA9IHt9IGFzIHtcbiAgICBkZWNsYXJhdGlvbnM6IG8uRXhwcmVzc2lvbixcbiAgICBpbXBvcnRzOiBvLkV4cHJlc3Npb24sXG4gICAgZXhwb3J0czogby5FeHByZXNzaW9uLFxuICB9O1xuXG4gIGlmIChkZWNsYXJhdGlvbnMubGVuZ3RoKSB7XG4gICAgc2NvcGVNYXAuZGVjbGFyYXRpb25zID0gcmVmc1RvQXJyYXkoZGVjbGFyYXRpb25zLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gIH1cblxuICBpZiAoaW1wb3J0cy5sZW5ndGgpIHtcbiAgICBzY29wZU1hcC5pbXBvcnRzID0gcmVmc1RvQXJyYXkoaW1wb3J0cywgY29udGFpbnNGb3J3YXJkRGVjbHMpO1xuICB9XG5cbiAgaWYgKGV4cG9ydHMubGVuZ3RoKSB7XG4gICAgc2NvcGVNYXAuZXhwb3J0cyA9IHJlZnNUb0FycmF5KGV4cG9ydHMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhzY29wZU1hcCkubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBzZXROZ01vZHVsZVNjb3BlKC4uLilcbiAgY29uc3QgZm5DYWxsID0gbmV3IG8uSW52b2tlRnVuY3Rpb25FeHByKFxuICAgICAgLyogZm4gKi8gby5pbXBvcnRFeHByKFIzLnNldE5nTW9kdWxlU2NvcGUpLFxuICAgICAgLyogYXJncyAqL1ttb2R1bGVUeXBlLCBtYXBUb01hcEV4cHJlc3Npb24oc2NvcGVNYXApXSk7XG5cbiAgLy8gKG5nSml0TW9kZSBndWFyZCkgJiYgc2V0TmdNb2R1bGVTY29wZSguLi4pXG4gIGNvbnN0IGd1YXJkZWRDYWxsID0gaml0T25seUd1YXJkZWRFeHByZXNzaW9uKGZuQ2FsbCk7XG5cbiAgLy8gZnVuY3Rpb24oKSB7IChuZ0ppdE1vZGUgZ3VhcmQpICYmIHNldE5nTW9kdWxlU2NvcGUoLi4uKTsgfVxuICBjb25zdCBpaWZlID0gbmV3IG8uRnVuY3Rpb25FeHByKFxuICAgICAgLyogcGFyYW1zICovW10sXG4gICAgICAvKiBzdGF0ZW1lbnRzICovW2d1YXJkZWRDYWxsLnRvU3RtdCgpXSk7XG5cbiAgLy8gKGZ1bmN0aW9uKCkgeyAobmdKaXRNb2RlIGd1YXJkKSAmJiBzZXROZ01vZHVsZVNjb3BlKC4uLik7IH0pKClcbiAgY29uc3QgaWlmZUNhbGwgPSBuZXcgby5JbnZva2VGdW5jdGlvbkV4cHIoXG4gICAgICAvKiBmbiAqLyBpaWZlLFxuICAgICAgLyogYXJncyAqL1tdKTtcblxuICByZXR1cm4gaWlmZUNhbGwudG9TdG10KCk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNJbmplY3RvckRlZiB7XG4gIGV4cHJlc3Npb246IG8uRXhwcmVzc2lvbjtcbiAgdHlwZTogby5UeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzSW5qZWN0b3JNZXRhZGF0YSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdHlwZTogUjNSZWZlcmVuY2U7XG4gIGludGVybmFsVHlwZTogby5FeHByZXNzaW9uO1xuICBwcm92aWRlcnM6IG8uRXhwcmVzc2lvbnxudWxsO1xuICBpbXBvcnRzOiBvLkV4cHJlc3Npb25bXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVJbmplY3RvcihtZXRhOiBSM0luamVjdG9yTWV0YWRhdGEpOiBSM0luamVjdG9yRGVmIHtcbiAgY29uc3QgZGVmaW5pdGlvbk1hcDogUmVjb3JkPHN0cmluZywgby5FeHByZXNzaW9uPiA9IHt9O1xuXG4gIGlmIChtZXRhLnByb3ZpZGVycyAhPT0gbnVsbCkge1xuICAgIGRlZmluaXRpb25NYXAucHJvdmlkZXJzID0gbWV0YS5wcm92aWRlcnM7XG4gIH1cblxuICBpZiAobWV0YS5pbXBvcnRzLmxlbmd0aCA+IDApIHtcbiAgICBkZWZpbml0aW9uTWFwLmltcG9ydHMgPSBvLmxpdGVyYWxBcnIobWV0YS5pbXBvcnRzKTtcbiAgfVxuXG4gIGNvbnN0IGV4cHJlc3Npb24gPSBvLmltcG9ydEV4cHIoUjMuZGVmaW5lSW5qZWN0b3IpLmNhbGxGbihbbWFwVG9NYXBFeHByZXNzaW9uKGRlZmluaXRpb25NYXApXSk7XG4gIGNvbnN0IHR5cGUgPVxuICAgICAgbmV3IG8uRXhwcmVzc2lvblR5cGUoby5pbXBvcnRFeHByKFIzLkluamVjdG9yRGVmLCBbbmV3IG8uRXhwcmVzc2lvblR5cGUobWV0YS50eXBlLnR5cGUpXSkpO1xuICByZXR1cm4ge2V4cHJlc3Npb24sIHR5cGV9O1xufVxuXG5mdW5jdGlvbiB0dXBsZVR5cGVPZihleHA6IFIzUmVmZXJlbmNlW10pOiBvLlR5cGUge1xuICBjb25zdCB0eXBlcyA9IGV4cC5tYXAocmVmID0+IG8udHlwZW9mRXhwcihyZWYudHlwZSkpO1xuICByZXR1cm4gZXhwLmxlbmd0aCA+IDAgPyBvLmV4cHJlc3Npb25UeXBlKG8ubGl0ZXJhbEFycih0eXBlcykpIDogby5OT05FX1RZUEU7XG59XG5cbmZ1bmN0aW9uIHJlZnNUb0FycmF5KHJlZnM6IFIzUmVmZXJlbmNlW10sIHNob3VsZEZvcndhcmREZWNsYXJlOiBib29sZWFuKTogby5FeHByZXNzaW9uIHtcbiAgY29uc3QgdmFsdWVzID0gby5saXRlcmFsQXJyKHJlZnMubWFwKHJlZiA9PiByZWYudmFsdWUpKTtcbiAgcmV0dXJuIHNob3VsZEZvcndhcmREZWNsYXJlID8gby5mbihbXSwgW25ldyBvLlJldHVyblN0YXRlbWVudCh2YWx1ZXMpXSkgOiB2YWx1ZXM7XG59XG4iXX0=