/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/render3/r3_module_compiler", ["require", "exports", "@angular/compiler/src/output/output_ast", "@angular/compiler/src/render3/r3_identifiers", "@angular/compiler/src/render3/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compileInjector = exports.compileNgModule = void 0;
    var o = require("@angular/compiler/src/output/output_ast");
    var r3_identifiers_1 = require("@angular/compiler/src/render3/r3_identifiers");
    var util_1 = require("@angular/compiler/src/render3/util");
    /**
     * Construct an `R3NgModuleDef` for the given `R3NgModuleMetadata`.
     */
    function compileNgModule(meta) {
        var internalType = meta.internalType, moduleType = meta.type, bootstrap = meta.bootstrap, declarations = meta.declarations, imports = meta.imports, exports = meta.exports, schemas = meta.schemas, containsForwardDecls = meta.containsForwardDecls, emitInline = meta.emitInline, id = meta.id;
        var additionalStatements = [];
        var definitionMap = { type: internalType };
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
            var setNgModuleScopeCall = generateSetNgModuleScopeCall(meta);
            if (setNgModuleScopeCall !== null) {
                additionalStatements.push(setNgModuleScopeCall);
            }
        }
        if (schemas && schemas.length) {
            definitionMap.schemas = o.literalArr(schemas.map(function (ref) { return ref.value; }));
        }
        if (id) {
            definitionMap.id = id;
        }
        var expression = o.importExpr(r3_identifiers_1.Identifiers.defineNgModule).callFn([util_1.mapToMapExpression(definitionMap)]);
        var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.NgModuleDefWithMeta, [
            new o.ExpressionType(moduleType.type), tupleTypeOf(declarations), tupleTypeOf(imports),
            tupleTypeOf(exports)
        ]));
        return { expression: expression, type: type, additionalStatements: additionalStatements };
    }
    exports.compileNgModule = compileNgModule;
    /**
     * Generates a function call to `ɵɵsetNgModuleScope` with all necessary information so that the
     * transitive module scope can be computed during runtime in JIT mode. This call is marked pure
     * such that the references to declarations, imports and exports may be elided causing these
     * symbols to become tree-shakeable.
     */
    function generateSetNgModuleScopeCall(meta) {
        var moduleType = meta.adjacentType, declarations = meta.declarations, imports = meta.imports, exports = meta.exports, containsForwardDecls = meta.containsForwardDecls;
        var scopeMap = {};
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
        var fnCall = new o.InvokeFunctionExpr(
        /* fn */ o.importExpr(r3_identifiers_1.Identifiers.setNgModuleScope), 
        /* args */ [moduleType, util_1.mapToMapExpression(scopeMap)]);
        // (ngJitMode guard) && setNgModuleScope(...)
        var guardedCall = util_1.jitOnlyGuardedExpression(fnCall);
        // function() { (ngJitMode guard) && setNgModuleScope(...); }
        var iife = new o.FunctionExpr(
        /* params */ [], 
        /* statements */ [guardedCall.toStmt()]);
        // (function() { (ngJitMode guard) && setNgModuleScope(...); })()
        var iifeCall = new o.InvokeFunctionExpr(
        /* fn */ iife, 
        /* args */ []);
        return iifeCall.toStmt();
    }
    function compileInjector(meta) {
        var definitionMap = {};
        if (meta.providers !== null) {
            definitionMap.providers = meta.providers;
        }
        if (meta.imports.length > 0) {
            definitionMap.imports = o.literalArr(meta.imports);
        }
        var expression = o.importExpr(r3_identifiers_1.Identifiers.defineInjector).callFn([util_1.mapToMapExpression(definitionMap)]);
        var type = new o.ExpressionType(o.importExpr(r3_identifiers_1.Identifiers.InjectorDef, [new o.ExpressionType(meta.type.type)]));
        return { expression: expression, type: type };
    }
    exports.compileInjector = compileInjector;
    function tupleTypeOf(exp) {
        var types = exp.map(function (ref) { return o.typeofExpr(ref.type); });
        return exp.length > 0 ? o.expressionType(o.literalArr(types)) : o.NONE_TYPE;
    }
    function refsToArray(refs, shouldForwardDeclare) {
        var values = o.literalArr(refs.map(function (ref) { return ref.value; }));
        return shouldForwardDeclare ? o.fn([], [new o.ReturnStatement(values)]) : values;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfbW9kdWxlX2NvbXBpbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3JlbmRlcjMvcjNfbW9kdWxlX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7OztJQUVILDJEQUEwQztJQUcxQywrRUFBbUQ7SUFDbkQsMkRBQWlGO0lBNEVqRjs7T0FFRztJQUNILFNBQWdCLGVBQWUsQ0FBQyxJQUF3QjtRQUVwRCxJQUFBLFlBQVksR0FVVixJQUFJLGFBVk0sRUFDTixVQUFVLEdBU2QsSUFBSSxLQVRVLEVBQ2hCLFNBQVMsR0FRUCxJQUFJLFVBUkcsRUFDVCxZQUFZLEdBT1YsSUFBSSxhQVBNLEVBQ1osT0FBTyxHQU1MLElBQUksUUFOQyxFQUNQLE9BQU8sR0FLTCxJQUFJLFFBTEMsRUFDUCxPQUFPLEdBSUwsSUFBSSxRQUpDLEVBQ1Asb0JBQW9CLEdBR2xCLElBQUkscUJBSGMsRUFDcEIsVUFBVSxHQUVSLElBQUksV0FGSSxFQUNWLEVBQUUsR0FDQSxJQUFJLEdBREosQ0FDSztRQUVULElBQU0sb0JBQW9CLEdBQWtCLEVBQUUsQ0FBQztRQUMvQyxJQUFNLGFBQWEsR0FBRyxFQUFDLElBQUksRUFBRSxZQUFZLEVBUXhDLENBQUM7UUFFRixvRUFBb0U7UUFDcEUsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO1lBQ3BCLGFBQWEsQ0FBQyxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsK0ZBQStGO1FBQy9GLDhEQUE4RDtRQUM5RCxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsYUFBYSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsWUFBWSxFQUFFLG9CQUFvQixDQUFDLENBQUM7YUFDOUU7WUFFRCxJQUFJLE9BQU8s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QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0YsT0FBTyxFQUFDLFVBQVUsWUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7SUFDNUIsQ0FBQztJQWZELDBDQWVDO0lBRUQsU0FBUyxXQUFXLENBQUMsR0FBa0I7UUFDckMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7UUFDckQsT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDOUUsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLElBQW1CLEVBQUUsb0JBQTZCO1FBQ3JFLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxLQUFLLEVBQVQsQ0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4RCxPQUFPLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNuRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuXG5pbXBvcnQge1IzRGVwZW5kZW5jeU1ldGFkYXRhLCBSM0ZhY3RvcnlGbn0gZnJvbSAnLi9yM19mYWN0b3J5JztcbmltcG9ydCB7SWRlbnRpZmllcnMgYXMgUjN9IGZyb20gJy4vcjNfaWRlbnRpZmllcnMnO1xuaW1wb3J0IHtqaXRPbmx5R3VhcmRlZEV4cHJlc3Npb24sIG1hcFRvTWFwRXhwcmVzc2lvbiwgUjNSZWZlcmVuY2V9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNOZ01vZHVsZURlZiB7XG4gIGV4cHJlc3Npb246IG8uRXhwcmVzc2lvbjtcbiAgdHlwZTogby5UeXBlO1xuICBhZGRpdGlvbmFsU3RhdGVtZW50czogby5TdGF0ZW1lbnRbXTtcbn1cblxuLyoqXG4gKiBNZXRhZGF0YSByZXF1aXJlZCBieSB0aGUgbW9kdWxlIGNvbXBpbGVyIHRvIGdlbmVyYXRlIGEgbW9kdWxlIGRlZiAoYMm1bW9kYCkgZm9yIGEgdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSM05nTW9kdWxlTWV0YWRhdGEge1xuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIG1vZHVsZSB0eXBlIGJlaW5nIGNvbXBpbGVkLlxuICAgKi9cbiAgdHlwZTogUjNSZWZlcmVuY2U7XG5cbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSBtb2R1bGUgdHlwZSBiZWluZyBjb21waWxlZCwgaW50ZW5kZWQgZm9yIHVzZSB3aXRoaW4gYSBjbGFzc1xuICAgKiBkZWZpbml0aW9uIGl0c2VsZi5cbiAgICpcbiAgICogVGhpcyBjYW4gZGlmZmVyIGZyb20gdGhlIG91dGVyIGB0eXBlYCBpZiB0aGUgY2xhc3MgaXMgYmVpbmcgY29tcGlsZWQgYnkgbmdjYyBhbmQgaXMgaW5zaWRlXG4gICAqIGFuIElJRkUgc3RydWN0dXJlIHRoYXQgdXNlcyBhIGRpZmZlcmVudCBuYW1lIGludGVybmFsbHkuXG4gICAqL1xuICBpbnRlcm5hbFR5cGU6IG8uRXhwcmVzc2lvbjtcblxuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiBpbnRlbmRlZCBmb3IgdXNlIGJ5IHN0YXRlbWVudHMgdGhhdCBhcmUgYWRqYWNlbnQgKGkuZS4gdGlnaHRseSBjb3VwbGVkKSB0byBidXRcbiAgICogbm90IGludGVybmFsIHRvIGEgY2xhc3MgZGVmaW5pdGlvbi5cbiAgICpcbiAgICogVGhpcyBjYW4gZGlmZmVyIGZyb20gdGhlIG91dGVyIGB0eXBlYCBpZiB0aGUgY2xhc3MgaXMgYmVpbmcgY29tcGlsZWQgYnkgbmdjYyBhbmQgaXMgaW5zaWRlXG4gICAqIGFuIElJRkUgc3RydWN0dXJlIHRoYXQgdXNlcyBhIGRpZmZlcmVudCBuYW1lIGludGVybmFsbHkuXG4gICAqL1xuICBhZGphY2VudFR5cGU6IG8uRXhwcmVzc2lvbjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBib290c3RyYXAgY29tcG9uZW50cyBzcGVjaWZpZWQgYnkgdGhlIG1vZHVsZS5cbiAgICovXG4gIGJvb3RzdHJhcDogUjNSZWZlcmVuY2VbXTtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgZXhwcmVzc2lvbnMgcmVwcmVzZW50aW5nIHRoZSBkaXJlY3RpdmVzIGFuZCBwaXBlcyBkZWNsYXJlZCBieSB0aGUgbW9kdWxlLlxuICAgKi9cbiAgZGVjbGFyYXRpb25zOiBSM1JlZmVyZW5jZVtdO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBleHByZXNzaW9ucyByZXByZXNlbnRpbmcgdGhlIGltcG9ydHMgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGltcG9ydHM6IFIzUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGV4cHJlc3Npb25zIHJlcHJlc2VudGluZyB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgZXhwb3J0czogUjNSZWZlcmVuY2VbXTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBlbWl0IHRoZSBzZWxlY3RvciBzY29wZSB2YWx1ZXMgKGRlY2xhcmF0aW9ucywgaW1wb3J0cywgZXhwb3J0cykgaW5saW5lIGludG8gdGhlXG4gICAqIG1vZHVsZSBkZWZpbml0aW9uLCBvciB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIHN0YXRlbWVudHMgd2hpY2ggcGF0Y2ggdGhlbSBvbi4gSW5saW5lIGVtaXNzaW9uXG4gICAqIGRvZXMgbm90IGFsbG93IGNvbXBvbmVudHMgdG8gYmUgdHJlZS1zaGFrZW4sIGJ1dCBpcyB1c2VmdWwgZm9yIEpJVCBtb2RlLlxuICAgKi9cbiAgZW1pdElubGluZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBnZW5lcmF0ZSBjbG9zdXJlIHdyYXBwZXJzIGZvciBib290c3RyYXAsIGRlY2xhcmF0aW9ucywgaW1wb3J0cywgYW5kIGV4cG9ydHMuXG4gICAqL1xuICBjb250YWluc0ZvcndhcmREZWNsczogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBzY2hlbWFzIHRoYXQgZGVjbGFyZSBlbGVtZW50cyB0byBiZSBhbGxvd2VkIGluIHRoZSBOZ01vZHVsZS5cbiAgICovXG4gIHNjaGVtYXM6IFIzUmVmZXJlbmNlW118bnVsbDtcblxuICAvKiogVW5pcXVlIElEIG9yIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSB1bmlxdWUgSUQgb2YgYW4gTmdNb2R1bGUuICovXG4gIGlkOiBvLkV4cHJlc3Npb258bnVsbDtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYW4gYFIzTmdNb2R1bGVEZWZgIGZvciB0aGUgZ2l2ZW4gYFIzTmdNb2R1bGVNZXRhZGF0YWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlTmdNb2R1bGUobWV0YTogUjNOZ01vZHVsZU1ldGFkYXRhKTogUjNOZ01vZHVsZURlZiB7XG4gIGNvbnN0IHtcbiAgICBpbnRlcm5hbFR5cGUsXG4gICAgdHlwZTogbW9kdWxlVHlwZSxcbiAgICBib290c3RyYXAsXG4gICAgZGVjbGFyYXRpb25zLFxuICAgIGltcG9ydHMsXG4gICAgZXhwb3J0cyxcbiAgICBzY2hlbWFzLFxuICAgIGNvbnRhaW5zRm9yd2FyZERlY2xzLFxuICAgIGVtaXRJbmxpbmUsXG4gICAgaWRcbiAgfSA9IG1ldGE7XG5cbiAgY29uc3QgYWRkaXRpb25hbFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgY29uc3QgZGVmaW5pdGlvbk1hcCA9IHt0eXBlOiBpbnRlcm5hbFR5cGV9IGFzIHtcbiAgICB0eXBlOiBvLkV4cHJlc3Npb24sXG4gICAgYm9vdHN0cmFwOiBvLkV4cHJlc3Npb24sXG4gICAgZGVjbGFyYXRpb25zOiBvLkV4cHJlc3Npb24sXG4gICAgaW1wb3J0czogby5FeHByZXNzaW9uLFxuICAgIGV4cG9ydHM6IG8uRXhwcmVzc2lvbixcbiAgICBzY2hlbWFzOiBvLkxpdGVyYWxBcnJheUV4cHIsXG4gICAgaWQ6IG8uRXhwcmVzc2lvblxuICB9O1xuXG4gIC8vIE9ubHkgZ2VuZXJhdGUgdGhlIGtleXMgaW4gdGhlIG1ldGFkYXRhIGlmIHRoZSBhcnJheXMgaGF2ZSB2YWx1ZXMuXG4gIGlmIChib290c3RyYXAubGVuZ3RoKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5ib290c3RyYXAgPSByZWZzVG9BcnJheShib290c3RyYXAsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgfVxuXG4gIC8vIElmIHJlcXVlc3RlZCB0byBlbWl0IHNjb3BlIGluZm9ybWF0aW9uIGlubGluZSwgcGFzcyB0aGUgZGVjbGFyYXRpb25zLCBpbXBvcnRzIGFuZCBleHBvcnRzIHRvXG4gIC8vIHRoZSBgybXJtWRlZmluZU5nTW9kdWxlYCBjYWxsLiBUaGUgSklUIGNvbXBpbGF0aW9uIHVzZXMgdGhpcy5cbiAgaWYgKGVtaXRJbmxpbmUpIHtcbiAgICBpZiAoZGVjbGFyYXRpb25zLmxlbmd0aCkge1xuICAgICAgZGVmaW5pdGlvbk1hcC5kZWNsYXJhdGlvbnMgPSByZWZzVG9BcnJheShkZWNsYXJhdGlvbnMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgICB9XG5cbiAgICBpZiAoaW1wb3J0cy5sZW5ndGgpIHtcbiAgICAgIGRlZmluaXRpb25NYXAuaW1wb3J0cyA9IHJlZnNUb0FycmF5KGltcG9ydHMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgICB9XG5cbiAgICBpZiAoZXhwb3J0cy5sZW5ndGgpIHtcbiAgICAgIGRlZmluaXRpb25NYXAuZXhwb3J0cyA9IHJlZnNUb0FycmF5KGV4cG9ydHMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBub3QgZW1pdHRpbmcgaW5saW5lLCB0aGUgc2NvcGUgaW5mb3JtYXRpb24gaXMgbm90IHBhc3NlZCBpbnRvIGDJtcm1ZGVmaW5lTmdNb2R1bGVgIGFzIGl0IHdvdWxkXG4gIC8vIHByZXZlbnQgdHJlZS1zaGFraW5nIG9mIHRoZSBkZWNsYXJhdGlvbnMsIGltcG9ydHMgYW5kIGV4cG9ydHMgcmVmZXJlbmNlcy5cbiAgZWxzZSB7XG4gICAgY29uc3Qgc2V0TmdNb2R1bGVTY29wZUNhbGwgPSBnZW5lcmF0ZVNldE5nTW9kdWxlU2NvcGVDYWxsKG1ldGEpO1xuICAgIGlmIChzZXROZ01vZHVsZVNjb3BlQ2FsbCAhPT0gbnVsbCkge1xuICAgICAgYWRkaXRpb25hbFN0YXRlbWVudHMucHVzaChzZXROZ01vZHVsZVNjb3BlQ2FsbCk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHNjaGVtYXMgJiYgc2NoZW1hcy5sZW5ndGgpIHtcbiAgICBkZWZpbml0aW9uTWFwLnNjaGVtYXMgPSBvLmxpdGVyYWxBcnIoc2NoZW1hcy5tYXAocmVmID0+IHJlZi52YWx1ZSkpO1xuICB9XG5cbiAgaWYgKGlkKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5pZCA9IGlkO1xuICB9XG5cbiAgY29uc3QgZXhwcmVzc2lvbiA9IG8uaW1wb3J0RXhwcihSMy5kZWZpbmVOZ01vZHVsZSkuY2FsbEZuKFttYXBUb01hcEV4cHJlc3Npb24oZGVmaW5pdGlvbk1hcCldKTtcbiAgY29uc3QgdHlwZSA9IG5ldyBvLkV4cHJlc3Npb25UeXBlKG8uaW1wb3J0RXhwcihSMy5OZ01vZHVsZURlZldpdGhNZXRhLCBbXG4gICAgbmV3IG8uRXhwcmVzc2lvblR5cGUobW9kdWxlVHlwZS50eXBlKSwgdHVwbGVUeXBlT2YoZGVjbGFyYXRpb25zKSwgdHVwbGVUeXBlT2YoaW1wb3J0cyksXG4gICAgdHVwbGVUeXBlT2YoZXhwb3J0cylcbiAgXSkpO1xuXG5cbiAgcmV0dXJuIHtleHByZXNzaW9uLCB0eXBlLCBhZGRpdGlvbmFsU3RhdGVtZW50c307XG59XG5cbi8qKlxuICogR2VuZXJhdGVzIGEgZnVuY3Rpb24gY2FsbCB0byBgybXJtXNldE5nTW9kdWxlU2NvcGVgIHdpdGggYWxsIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbiBzbyB0aGF0IHRoZVxuICogdHJhbnNpdGl2ZSBtb2R1bGUgc2NvcGUgY2FuIGJlIGNvbXB1dGVkIGR1cmluZyBydW50aW1lIGluIEpJVCBtb2RlLiBUaGlzIGNhbGwgaXMgbWFya2VkIHB1cmVcbiAqIHN1Y2ggdGhhdCB0aGUgcmVmZXJlbmNlcyB0byBkZWNsYXJhdGlvbnMsIGltcG9ydHMgYW5kIGV4cG9ydHMgbWF5IGJlIGVsaWRlZCBjYXVzaW5nIHRoZXNlXG4gKiBzeW1ib2xzIHRvIGJlY29tZSB0cmVlLXNoYWtlYWJsZS5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJhdGVTZXROZ01vZHVsZVNjb3BlQ2FsbChtZXRhOiBSM05nTW9kdWxlTWV0YWRhdGEpOiBvLlN0YXRlbWVudHxudWxsIHtcbiAgY29uc3Qge2FkamFjZW50VHlwZTogbW9kdWxlVHlwZSwgZGVjbGFyYXRpb25zLCBpbXBvcnRzLCBleHBvcnRzLCBjb250YWluc0ZvcndhcmREZWNsc30gPSBtZXRhO1xuXG4gIGNvbnN0IHNjb3BlTWFwID0ge30gYXMge1xuICAgIGRlY2xhcmF0aW9uczogby5FeHByZXNzaW9uLFxuICAgIGltcG9ydHM6IG8uRXhwcmVzc2lvbixcbiAgICBleHBvcnRzOiBvLkV4cHJlc3Npb24sXG4gIH07XG5cbiAgaWYgKGRlY2xhcmF0aW9ucy5sZW5ndGgpIHtcbiAgICBzY29wZU1hcC5kZWNsYXJhdGlvbnMgPSByZWZzVG9BcnJheShkZWNsYXJhdGlvbnMsIGNvbnRhaW5zRm9yd2FyZERlY2xzKTtcbiAgfVxuXG4gIGlmIChpbXBvcnRzLmxlbmd0aCkge1xuICAgIHNjb3BlTWFwLmltcG9ydHMgPSByZWZzVG9BcnJheShpbXBvcnRzLCBjb250YWluc0ZvcndhcmREZWNscyk7XG4gIH1cblxuICBpZiAoZXhwb3J0cy5sZW5ndGgpIHtcbiAgICBzY29wZU1hcC5leHBvcnRzID0gcmVmc1RvQXJyYXkoZXhwb3J0cywgY29udGFpbnNGb3J3YXJkRGVjbHMpO1xuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKHNjb3BlTWFwKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIHNldE5nTW9kdWxlU2NvcGUoLi4uKVxuICBjb25zdCBmbkNhbGwgPSBuZXcgby5JbnZva2VGdW5jdGlvbkV4cHIoXG4gICAgICAvKiBmbiAqLyBvLmltcG9ydEV4cHIoUjMuc2V0TmdNb2R1bGVTY29wZSksXG4gICAgICAvKiBhcmdzICovW21vZHVsZVR5cGUsIG1hcFRvTWFwRXhwcmVzc2lvbihzY29wZU1hcCldKTtcblxuICAvLyAobmdKaXRNb2RlIGd1YXJkKSAmJiBzZXROZ01vZHVsZVNjb3BlKC4uLilcbiAgY29uc3QgZ3VhcmRlZENhbGwgPSBqaXRPbmx5R3VhcmRlZEV4cHJlc3Npb24oZm5DYWxsKTtcblxuICAvLyBmdW5jdGlvbigpIHsgKG5nSml0TW9kZSBndWFyZCkgJiYgc2V0TmdNb2R1bGVTY29wZSguLi4pOyB9XG4gIGNvbnN0IGlpZmUgPSBuZXcgby5GdW5jdGlvbkV4cHIoXG4gICAgICAvKiBwYXJhbXMgKi9bXSxcbiAgICAgIC8qIHN0YXRlbWVudHMgKi9bZ3VhcmRlZENhbGwudG9TdG10KCldKTtcblxuICAvLyAoZnVuY3Rpb24oKSB7IChuZ0ppdE1vZGUgZ3VhcmQpICYmIHNldE5nTW9kdWxlU2NvcGUoLi4uKTsgfSkoKVxuICBjb25zdCBpaWZlQ2FsbCA9IG5ldyBvLkludm9rZUZ1bmN0aW9uRXhwcihcbiAgICAgIC8qIGZuICovIGlpZmUsXG4gICAgICAvKiBhcmdzICovW10pO1xuXG4gIHJldHVybiBpaWZlQ2FsbC50b1N0bXQoKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0luamVjdG9yRGVmIHtcbiAgZXhwcmVzc2lvbjogby5FeHByZXNzaW9uO1xuICB0eXBlOiBvLlR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNJbmplY3Rvck1ldGFkYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0eXBlOiBSM1JlZmVyZW5jZTtcbiAgaW50ZXJuYWxUeXBlOiBvLkV4cHJlc3Npb247XG4gIHByb3ZpZGVyczogby5FeHByZXNzaW9ufG51bGw7XG4gIGltcG9ydHM6IG8uRXhwcmVzc2lvbltdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZUluamVjdG9yKG1ldGE6IFIzSW5qZWN0b3JNZXRhZGF0YSk6IFIzSW5qZWN0b3JEZWYge1xuICBjb25zdCBkZWZpbml0aW9uTWFwOiBSZWNvcmQ8c3RyaW5nLCBvLkV4cHJlc3Npb24+ID0ge307XG5cbiAgaWYgKG1ldGEucHJvdmlkZXJzICE9PSBudWxsKSB7XG4gICAgZGVmaW5pdGlvbk1hcC5wcm92aWRlcnMgPSBtZXRhLnByb3ZpZGVycztcbiAgfVxuXG4gIGlmIChtZXRhLmltcG9ydHMubGVuZ3RoID4gMCkge1xuICAgIGRlZmluaXRpb25NYXAuaW1wb3J0cyA9IG8ubGl0ZXJhbEFycihtZXRhLmltcG9ydHMpO1xuICB9XG5cbiAgY29uc3QgZXhwcmVzc2lvbiA9IG8uaW1wb3J0RXhwcihSMy5kZWZpbmVJbmplY3RvcikuY2FsbEZuKFttYXBUb01hcEV4cHJlc3Npb24oZGVmaW5pdGlvbk1hcCldKTtcbiAgY29uc3QgdHlwZSA9XG4gICAgICBuZXcgby5FeHByZXNzaW9uVHlwZShvLmltcG9ydEV4cHIoUjMuSW5qZWN0b3JEZWYsIFtuZXcgby5FeHByZXNzaW9uVHlwZShtZXRhLnR5cGUudHlwZSldKSk7XG4gIHJldHVybiB7ZXhwcmVzc2lvbiwgdHlwZX07XG59XG5cbmZ1bmN0aW9uIHR1cGxlVHlwZU9mKGV4cDogUjNSZWZlcmVuY2VbXSk6IG8uVHlwZSB7XG4gIGNvbnN0IHR5cGVzID0gZXhwLm1hcChyZWYgPT4gby50eXBlb2ZFeHByKHJlZi50eXBlKSk7XG4gIHJldHVybiBleHAubGVuZ3RoID4gMCA/IG8uZXhwcmVzc2lvblR5cGUoby5saXRlcmFsQXJyKHR5cGVzKSkgOiBvLk5PTkVfVFlQRTtcbn1cblxuZnVuY3Rpb24gcmVmc1RvQXJyYXkocmVmczogUjNSZWZlcmVuY2VbXSwgc2hvdWxkRm9yd2FyZERlY2xhcmU6IGJvb2xlYW4pOiBvLkV4cHJlc3Npb24ge1xuICBjb25zdCB2YWx1ZXMgPSBvLmxpdGVyYWxBcnIocmVmcy5tYXAocmVmID0+IHJlZi52YWx1ZSkpO1xuICByZXR1cm4gc2hvdWxkRm9yd2FyZERlY2xhcmUgPyBvLmZuKFtdLCBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KHZhbHVlcyldKSA6IHZhbHVlcztcbn1cbiJdfQ==