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
        define("@angular/compiler-cli/ngcc/src/writing/package_json_updater", ["require", "exports", "tslib", "@angular/compiler-cli/src/ngtsc/file_system"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyChange = exports.DirectPackageJsonUpdater = exports.PackageJsonUpdate = void 0;
    var tslib_1 = require("tslib");
    var file_system_1 = require("@angular/compiler-cli/src/ngtsc/file_system");
    /**
     * A utility class providing a fluent API for recording multiple changes to a `package.json` file
     * (and optionally its in-memory parsed representation).
     *
     * NOTE: This class should generally not be instantiated directly; instances are implicitly created
     *       via `PackageJsonUpdater#createUpdate()`.
     */
    var PackageJsonUpdate = /** @class */ (function () {
        function PackageJsonUpdate(writeChangesImpl) {
            this.writeChangesImpl = writeChangesImpl;
            this.changes = [];
            this.applied = false;
        }
        /**
         * Record a change to a `package.json` property.
         *
         * If the ancestor objects do not yet exist in the `package.json` file, they will be created. The
         * positioning of the property can also be specified. (If the property already exists, it will be
         * moved accordingly.)
         *
         * NOTE: Property positioning is only guaranteed to be respected in the serialized `package.json`
         *       file. Positioning will not be taken into account when updating in-memory representations.
         *
         * NOTE 2: Property positioning only affects the last property in `propertyPath`. Ancestor
         *         objects' positioning will not be affected.
         *
         * @param propertyPath The path of a (possibly nested) property to add/update.
         * @param value The new value to set the property to.
         * @param position The desired position for the added/updated property.
         */
        PackageJsonUpdate.prototype.addChange = function (propertyPath, value, positioning) {
            if (positioning === void 0) { positioning = 'unimportant'; }
            this.ensureNotApplied();
            this.changes.push([propertyPath, value, positioning]);
            return this;
        };
        /**
         * Write the recorded changes to the associated `package.json` file (and optionally a
         * pre-existing, in-memory representation of it).
         *
         * @param packageJsonPath The path to the `package.json` file that needs to be updated.
         * @param parsedJson A pre-existing, in-memory representation of the `package.json` file that
         *                   needs to be updated as well.
         */
        PackageJsonUpdate.prototype.writeChanges = function (packageJsonPath, parsedJson) {
            this.ensureNotApplied();
            this.writeChangesImpl(this.changes, packageJsonPath, parsedJson);
            this.applied = true;
        };
        PackageJsonUpdate.prototype.ensureNotApplied = function () {
            if (this.applied) {
                throw new Error('Trying to apply a `PackageJsonUpdate` that has already been applied.');
            }
        };
        return PackageJsonUpdate;
    }());
    exports.PackageJsonUpdate = PackageJsonUpdate;
    /** A `PackageJsonUpdater` that writes directly to the file-system. */
    var DirectPackageJsonUpdater = /** @class */ (function () {
        function DirectPackageJsonUpdater(fs) {
            this.fs = fs;
        }
        DirectPackageJsonUpdater.prototype.createUpdate = function () {
            var _this = this;
            return new PackageJsonUpdate(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.writeChanges.apply(_this, tslib_1.__spread(args));
            });
        };
        DirectPackageJsonUpdater.prototype.writeChanges = function (changes, packageJsonPath, preExistingParsedJson) {
            var e_1, _a;
            if (changes.length === 0) {
                throw new Error("No changes to write to '" + packageJsonPath + "'.");
            }
            // Read and parse the `package.json` content.
            // NOTE: We are not using `preExistingParsedJson` (even if specified) to avoid corrupting the
            //       content on disk in case `preExistingParsedJson` is outdated.
            var parsedJson = this.fs.exists(packageJsonPath) ?
                JSON.parse(this.fs.readFile(packageJsonPath)) :
                {};
            try {
                // Apply all changes to both the canonical representation (read from disk) and any pre-existing,
                // in-memory representation.
                for (var changes_1 = tslib_1.__values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
                    var _b = tslib_1.__read(changes_1_1.value, 3), propPath = _b[0], value = _b[1], positioning = _b[2];
                    if (propPath.length === 0) {
                        throw new Error("Missing property path for writing value to '" + packageJsonPath + "'.");
                    }
                    applyChange(parsedJson, propPath, value, positioning);
                    if (preExistingParsedJson) {
                        // No need to take property positioning into account for in-memory representations.
                        applyChange(preExistingParsedJson, propPath, value, 'unimportant');
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (changes_1_1 && !changes_1_1.done && (_a = changes_1.return)) _a.call(changes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // Ensure the containing directory exists (in case this is a synthesized `package.json` due to a
            // custom configuration) and write the updated content to disk.
            this.fs.ensureDir(file_system_1.dirname(packageJsonPath));
            this.fs.writeFile(packageJsonPath, JSON.stringify(parsedJson, null, 2) + "\n");
        };
        return DirectPackageJsonUpdater;
    }());
    exports.DirectPackageJsonUpdater = DirectPackageJsonUpdater;
    // Helpers
    function applyChange(ctx, propPath, value, positioning) {
        var lastPropIdx = propPath.length - 1;
        var lastProp = propPath[lastPropIdx];
        for (var i = 0; i < lastPropIdx; i++) {
            var key = propPath[i];
            var newCtx = ctx.hasOwnProperty(key) ? ctx[key] : (ctx[key] = {});
            if ((typeof newCtx !== 'object') || (newCtx === null) || Array.isArray(newCtx)) {
                throw new Error("Property path '" + propPath.join('.') + "' does not point to an object.");
            }
            ctx = newCtx;
        }
        ctx[lastProp] = value;
        positionProperty(ctx, lastProp, positioning);
    }
    exports.applyChange = applyChange;
    function movePropBefore(ctx, prop, isNextProp) {
        var allProps = Object.keys(ctx);
        var otherProps = allProps.filter(function (p) { return p !== prop; });
        var nextPropIdx = otherProps.findIndex(isNextProp);
        var propsToShift = (nextPropIdx === -1) ? [] : otherProps.slice(nextPropIdx);
        movePropToEnd(ctx, prop);
        propsToShift.forEach(function (p) { return movePropToEnd(ctx, p); });
    }
    function movePropToEnd(ctx, prop) {
        var value = ctx[prop];
        delete ctx[prop];
        ctx[prop] = value;
    }
    function positionProperty(ctx, prop, positioning) {
        switch (positioning) {
            case 'alphabetic':
                movePropBefore(ctx, prop, function (p) { return p > prop; });
                break;
            case 'unimportant':
                // Leave the property order unchanged; i.e. newly added properties will be last and existing
                // ones will remain in their old position.
                break;
            default:
                if ((typeof positioning !== 'object') || (positioning.before === undefined)) {
                    throw new Error("Unknown positioning (" + JSON.stringify(positioning) + ") for property '" + prop + "'.");
                }
                movePropBefore(ctx, prop, function (p) { return p === positioning.before; });
                break;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZV9qc29uX3VwZGF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvbmdjYy9zcmMvd3JpdGluZy9wYWNrYWdlX2pzb25fdXBkYXRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsMkVBQW1GO0lBK0NuRjs7Ozs7O09BTUc7SUFDSDtRQUlFLDJCQUFvQixnQkFBMkM7WUFBM0MscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEyQjtZQUh2RCxZQUFPLEdBQXdCLEVBQUUsQ0FBQztZQUNsQyxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRTBDLENBQUM7UUFFbkU7Ozs7Ozs7Ozs7Ozs7Ozs7V0FnQkc7UUFDSCxxQ0FBUyxHQUFULFVBQ0ksWUFBc0IsRUFBRSxLQUFnQixFQUN4QyxXQUEyRDtZQUEzRCw0QkFBQSxFQUFBLDJCQUEyRDtZQUM3RCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN0RCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRDs7Ozs7OztXQU9HO1FBQ0gsd0NBQVksR0FBWixVQUFhLGVBQStCLEVBQUUsVUFBdUI7WUFDbkUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDeEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLENBQUM7UUFFTyw0Q0FBZ0IsR0FBeEI7WUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLENB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U0FBUyxhQUFhLENBQUMsR0FBZSxFQUFFLElBQVk7UUFDbEQsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELFNBQVMsZ0JBQWdCLENBQ3JCLEdBQWUsRUFBRSxJQUFZLEVBQUUsV0FBMkM7UUFDNUUsUUFBUSxXQUFXLEVBQUU7WUFDbkIsS0FBSyxZQUFZO2dCQUNmLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxHQUFHLElBQUksRUFBUixDQUFRLENBQUMsQ0FBQztnQkFDekMsTUFBTTtZQUNSLEtBQUssYUFBYTtnQkFDaEIsNEZBQTRGO2dCQUM1RiwwQ0FBMEM7Z0JBQzFDLE1BQU07WUFDUjtnQkFDRSxJQUFJLENBQUMsT0FBTyxXQUFXLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxFQUFFO29CQUMzRSxNQUFNLElBQUksS0FBSyxDQUNYLDBCQUF3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyx3QkFBbUIsSUFBSSxPQUFJLENBQUMsQ0FBQztpQkFDckY7Z0JBRUQsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssV0FBVyxDQUFDLE1BQU0sRUFBeEIsQ0FBd0IsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1NBQ1Q7SUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QWJzb2x1dGVGc1BhdGgsIGRpcm5hbWUsIEZpbGVTeXN0ZW19IGZyb20gJy4uLy4uLy4uL3NyYy9uZ3RzYy9maWxlX3N5c3RlbSc7XG5pbXBvcnQge0pzb25PYmplY3QsIEpzb25WYWx1ZX0gZnJvbSAnLi4vcGFja2FnZXMvZW50cnlfcG9pbnQnO1xuXG5cbmV4cG9ydCB0eXBlIFBhY2thZ2VKc29uQ2hhbmdlID0gW3N0cmluZ1tdLCBKc29uVmFsdWUsIFBhY2thZ2VKc29uUHJvcGVydHlQb3NpdGlvbmluZ107XG5leHBvcnQgdHlwZSBQYWNrYWdlSnNvblByb3BlcnR5UG9zaXRpb25pbmcgPSAndW5pbXBvcnRhbnQnfCdhbHBoYWJldGljJ3x7YmVmb3JlOiBzdHJpbmd9O1xuZXhwb3J0IHR5cGUgV3JpdGVQYWNrYWdlSnNvbkNoYW5nZXNGbiA9XG4gICAgKGNoYW5nZXM6IFBhY2thZ2VKc29uQ2hhbmdlW10sIHBhY2thZ2VKc29uUGF0aDogQWJzb2x1dGVGc1BhdGgsIHBhcnNlZEpzb24/OiBKc29uT2JqZWN0KSA9PlxuICAgICAgICB2b2lkO1xuXG4vKipcbiAqIEEgdXRpbGl0eSBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBzYWZlbHkgdXBkYXRlIHZhbHVlcyBpbiBhIGBwYWNrYWdlLmpzb25gIGZpbGUuXG4gKlxuICogRXhhbXBsZSB1c2FnZTpcbiAqIGBgYHRzXG4gKiBjb25zdCB1cGRhdGVQYWNrYWdlSnNvbiA9IHBhY2thZ2VKc29uVXBkYXRlclxuICogICAgIC5jcmVhdGVVcGRhdGUoKVxuICogICAgIC5hZGRDaGFuZ2UoWyduYW1lJ10sICdwYWNrYWdlLWZvbycpXG4gKiAgICAgLmFkZENoYW5nZShbJ3NjcmlwdHMnLCAnZm9vJ10sICdlY2hvIEZPT09PLi4uJywgJ3VuaW1wb3J0YW50JylcbiAqICAgICAuYWRkQ2hhbmdlKFsnZGVwZW5kZW5jaWVzJywgJ2JheiddLCAnMS4wLjAnLCAnYWxwaGFiZXRpYycpXG4gKiAgICAgLmFkZENoYW5nZShbJ2RlcGVuZGVuY2llcycsICdiYXInXSwgJzIuMC4wJywge2JlZm9yZTogJ2Jheid9KVxuICogICAgIC53cml0ZUNoYW5nZXMoJy9mb28vcGFja2FnZS5qc29uJyk7XG4gKiAgICAgLy8gb3JcbiAqICAgICAvLyAud3JpdGVDaGFuZ2VzKCcvZm9vL3BhY2thZ2UuanNvbicsIGluTWVtb3J5UGFyc2VkSnNvbik7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYWNrYWdlSnNvblVwZGF0ZXIge1xuICAvKipcbiAgICogQ3JlYXRlIGEgYFBhY2thZ2VKc29uVXBkYXRlYCBvYmplY3QsIHdoaWNoIHByb3ZpZGVzIGEgZmx1ZW50IEFQSSBmb3IgYmF0Y2hpbmcgdXBkYXRlcyB0byBhXG4gICAqIGBwYWNrYWdlLmpzb25gIGZpbGUuIChCYXRjaGluZyB0aGUgdXBkYXRlcyBpcyB1c2VmdWwsIGJlY2F1c2UgaXQgYXZvaWRzIHVubmVjZXNzYXJ5IEkvT1xuICAgKiBvcGVyYXRpb25zLilcbiAgICovXG4gIGNyZWF0ZVVwZGF0ZSgpOiBQYWNrYWdlSnNvblVwZGF0ZTtcblxuICAvKipcbiAgICogV3JpdGUgYSBzZXQgb2YgY2hhbmdlcyB0byB0aGUgc3BlY2lmaWVkIGBwYWNrYWdlLmpzb25gIGZpbGUgKGFuZCBvcHRpb25hbGx5IGEgcHJlLWV4aXN0aW5nLFxuICAgKiBpbi1tZW1vcnkgcmVwcmVzZW50YXRpb24gb2YgaXQpLlxuICAgKlxuICAgKiBAcGFyYW0gY2hhbmdlcyBUaGUgc2V0IG9mIGNoYW5nZXMgdG8gYXBwbHkuXG4gICAqIEBwYXJhbSBwYWNrYWdlSnNvblBhdGggVGhlIHBhdGggdG8gdGhlIGBwYWNrYWdlLmpzb25gIGZpbGUgdGhhdCBuZWVkcyB0byBiZSB1cGRhdGVkLlxuICAgKiBAcGFyYW0gcGFyc2VkSnNvbiBBIHByZS1leGlzdGluZywgaW4tbWVtb3J5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlIHRoYXRcbiAgICogICAgICAgICAgICAgICAgICAgbmVlZHMgdG8gYmUgdXBkYXRlZCBhcyB3ZWxsLlxuICAgKi9cbiAgd3JpdGVDaGFuZ2VzKFxuICAgICAgY2hhbmdlczogUGFja2FnZUpzb25DaGFuZ2VbXSwgcGFja2FnZUpzb25QYXRoOiBBYnNvbHV0ZUZzUGF0aCwgcGFyc2VkSnNvbj86IEpzb25PYmplY3QpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgdXRpbGl0eSBjbGFzcyBwcm92aWRpbmcgYSBmbHVlbnQgQVBJIGZvciByZWNvcmRpbmcgbXVsdGlwbGUgY2hhbmdlcyB0byBhIGBwYWNrYWdlLmpzb25gIGZpbGVcbiAqIChhbmQgb3B0aW9uYWxseSBpdHMgaW4tbWVtb3J5IHBhcnNlZCByZXByZXNlbnRhdGlvbikuXG4gKlxuICogTk9URTogVGhpcyBjbGFzcyBzaG91bGQgZ2VuZXJhbGx5IG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHk7IGluc3RhbmNlcyBhcmUgaW1wbGljaXRseSBjcmVhdGVkXG4gKiAgICAgICB2aWEgYFBhY2thZ2VKc29uVXBkYXRlciNjcmVhdGVVcGRhdGUoKWAuXG4gKi9cbmV4cG9ydCBjbGFzcyBQYWNrYWdlSnNvblVwZGF0ZSB7XG4gIHByaXZhdGUgY2hhbmdlczogUGFja2FnZUpzb25DaGFuZ2VbXSA9IFtdO1xuICBwcml2YXRlIGFwcGxpZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdyaXRlQ2hhbmdlc0ltcGw6IFdyaXRlUGFja2FnZUpzb25DaGFuZ2VzRm4pIHt9XG5cbiAgLyoqXG4gICAqIFJlY29yZCBhIGNoYW5nZSB0byBhIGBwYWNrYWdlLmpzb25gIHByb3BlcnR5LlxuICAgKlxuICAgKiBJZiB0aGUgYW5jZXN0b3Igb2JqZWN0cyBkbyBub3QgeWV0IGV4aXN0IGluIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLCB0aGV5IHdpbGwgYmUgY3JlYXRlZC4gVGhlXG4gICAqIHBvc2l0aW9uaW5nIG9mIHRoZSBwcm9wZXJ0eSBjYW4gYWxzbyBiZSBzcGVjaWZpZWQuIChJZiB0aGUgcHJvcGVydHkgYWxyZWFkeSBleGlzdHMsIGl0IHdpbGwgYmVcbiAgICogbW92ZWQgYWNjb3JkaW5nbHkuKVxuICAgKlxuICAgKiBOT1RFOiBQcm9wZXJ0eSBwb3NpdGlvbmluZyBpcyBvbmx5IGd1YXJhbnRlZWQgdG8gYmUgcmVzcGVjdGVkIGluIHRoZSBzZXJpYWxpemVkIGBwYWNrYWdlLmpzb25gXG4gICAqICAgICAgIGZpbGUuIFBvc2l0aW9uaW5nIHdpbGwgbm90IGJlIHRha2VuIGludG8gYWNjb3VudCB3aGVuIHVwZGF0aW5nIGluLW1lbW9yeSByZXByZXNlbnRhdGlvbnMuXG4gICAqXG4gICAqIE5PVEUgMjogUHJvcGVydHkgcG9zaXRpb25pbmcgb25seSBhZmZlY3RzIHRoZSBsYXN0IHByb3BlcnR5IGluIGBwcm9wZXJ0eVBhdGhgLiBBbmNlc3RvclxuICAgKiAgICAgICAgIG9iamVjdHMnIHBvc2l0aW9uaW5nIHdpbGwgbm90IGJlIGFmZmVjdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcGVydHlQYXRoIFRoZSBwYXRoIG9mIGEgKHBvc3NpYmx5IG5lc3RlZCkgcHJvcGVydHkgdG8gYWRkL3VwZGF0ZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gc2V0IHRoZSBwcm9wZXJ0eSB0by5cbiAgICogQHBhcmFtIHBvc2l0aW9uIFRoZSBkZXNpcmVkIHBvc2l0aW9uIGZvciB0aGUgYWRkZWQvdXBkYXRlZCBwcm9wZXJ0eS5cbiAgICovXG4gIGFkZENoYW5nZShcbiAgICAgIHByb3BlcnR5UGF0aDogc3RyaW5nW10sIHZhbHVlOiBKc29uVmFsdWUsXG4gICAgICBwb3NpdGlvbmluZzogUGFja2FnZUpzb25Qcm9wZXJ0eVBvc2l0aW9uaW5nID0gJ3VuaW1wb3J0YW50Jyk6IHRoaXMge1xuICAgIHRoaXMuZW5zdXJlTm90QXBwbGllZCgpO1xuICAgIHRoaXMuY2hhbmdlcy5wdXNoKFtwcm9wZXJ0eVBhdGgsIHZhbHVlLCBwb3NpdGlvbmluZ10pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIHRoZSByZWNvcmRlZCBjaGFuZ2VzIHRvIHRoZSBhc3NvY2lhdGVkIGBwYWNrYWdlLmpzb25gIGZpbGUgKGFuZCBvcHRpb25hbGx5IGFcbiAgICogcHJlLWV4aXN0aW5nLCBpbi1tZW1vcnkgcmVwcmVzZW50YXRpb24gb2YgaXQpLlxuICAgKlxuICAgKiBAcGFyYW0gcGFja2FnZUpzb25QYXRoIFRoZSBwYXRoIHRvIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlIHRoYXQgbmVlZHMgdG8gYmUgdXBkYXRlZC5cbiAgICogQHBhcmFtIHBhcnNlZEpzb24gQSBwcmUtZXhpc3RpbmcsIGluLW1lbW9yeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYHBhY2thZ2UuanNvbmAgZmlsZSB0aGF0XG4gICAqICAgICAgICAgICAgICAgICAgIG5lZWRzIHRvIGJlIHVwZGF0ZWQgYXMgd2VsbC5cbiAgICovXG4gIHdyaXRlQ2hhbmdlcyhwYWNrYWdlSnNvblBhdGg6IEFic29sdXRlRnNQYXRoLCBwYXJzZWRKc29uPzogSnNvbk9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMuZW5zdXJlTm90QXBwbGllZCgpO1xuICAgIHRoaXMud3JpdGVDaGFuZ2VzSW1wbCh0aGlzLmNoYW5nZXMsIHBhY2thZ2VKc29uUGF0aCwgcGFyc2VkSnNvbik7XG4gICAgdGhpcy5hcHBsaWVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZW5zdXJlTm90QXBwbGllZCgpIHtcbiAgICBpZiAodGhpcy5hcHBsaWVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyeWluZyB0byBhcHBseSBhIGBQYWNrYWdlSnNvblVwZGF0ZWAgdGhhdCBoYXMgYWxyZWFkeSBiZWVuIGFwcGxpZWQuJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKiBBIGBQYWNrYWdlSnNvblVwZGF0ZXJgIHRoYXQgd3JpdGVzIGRpcmVjdGx5IHRvIHRoZSBmaWxlLXN5c3RlbS4gKi9cbmV4cG9ydCBjbGFzcyBEaXJlY3RQYWNrYWdlSnNvblVwZGF0ZXIgaW1wbGVtZW50cyBQYWNrYWdlSnNvblVwZGF0ZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZzOiBGaWxlU3lzdGVtKSB7fVxuXG4gIGNyZWF0ZVVwZGF0ZSgpOiBQYWNrYWdlSnNvblVwZGF0ZSB7XG4gICAgcmV0dXJuIG5ldyBQYWNrYWdlSnNvblVwZGF0ZSgoLi4uYXJncykgPT4gdGhpcy53cml0ZUNoYW5nZXMoLi4uYXJncykpO1xuICB9XG5cbiAgd3JpdGVDaGFuZ2VzKFxuICAgICAgY2hhbmdlczogUGFja2FnZUpzb25DaGFuZ2VbXSwgcGFja2FnZUpzb25QYXRoOiBBYnNvbHV0ZUZzUGF0aCxcbiAgICAgIHByZUV4aXN0aW5nUGFyc2VkSnNvbj86IEpzb25PYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gY2hhbmdlcyB0byB3cml0ZSB0byAnJHtwYWNrYWdlSnNvblBhdGh9Jy5gKTtcbiAgICB9XG5cbiAgICAvLyBSZWFkIGFuZCBwYXJzZSB0aGUgYHBhY2thZ2UuanNvbmAgY29udGVudC5cbiAgICAvLyBOT1RFOiBXZSBhcmUgbm90IHVzaW5nIGBwcmVFeGlzdGluZ1BhcnNlZEpzb25gIChldmVuIGlmIHNwZWNpZmllZCkgdG8gYXZvaWQgY29ycnVwdGluZyB0aGVcbiAgICAvLyAgICAgICBjb250ZW50IG9uIGRpc2sgaW4gY2FzZSBgcHJlRXhpc3RpbmdQYXJzZWRKc29uYCBpcyBvdXRkYXRlZC5cbiAgICBjb25zdCBwYXJzZWRKc29uID0gdGhpcy5mcy5leGlzdHMocGFja2FnZUpzb25QYXRoKSA/XG4gICAgICAgIEpTT04ucGFyc2UodGhpcy5mcy5yZWFkRmlsZShwYWNrYWdlSnNvblBhdGgpKSBhcyBKc29uT2JqZWN0IDpcbiAgICAgICAge307XG5cbiAgICAvLyBBcHBseSBhbGwgY2hhbmdlcyB0byBib3RoIHRoZSBjYW5vbmljYWwgcmVwcmVzZW50YXRpb24gKHJlYWQgZnJvbSBkaXNrKSBhbmQgYW55IHByZS1leGlzdGluZyxcbiAgICAvLyBpbi1tZW1vcnkgcmVwcmVzZW50YXRpb24uXG4gICAgZm9yIChjb25zdCBbcHJvcFBhdGgsIHZhbHVlLCBwb3NpdGlvbmluZ10gb2YgY2hhbmdlcykge1xuICAgICAgaWYgKHByb3BQYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgcHJvcGVydHkgcGF0aCBmb3Igd3JpdGluZyB2YWx1ZSB0byAnJHtwYWNrYWdlSnNvblBhdGh9Jy5gKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlDaGFuZ2UocGFyc2VkSnNvbiwgcHJvcFBhdGgsIHZhbHVlLCBwb3NpdGlvbmluZyk7XG5cbiAgICAgIGlmIChwcmVFeGlzdGluZ1BhcnNlZEpzb24pIHtcbiAgICAgICAgLy8gTm8gbmVlZCB0byB0YWtlIHByb3BlcnR5IHBvc2l0aW9uaW5nIGludG8gYWNjb3VudCBmb3IgaW4tbWVtb3J5IHJlcHJlc2VudGF0aW9ucy5cbiAgICAgICAgYXBwbHlDaGFuZ2UocHJlRXhpc3RpbmdQYXJzZWRKc29uLCBwcm9wUGF0aCwgdmFsdWUsICd1bmltcG9ydGFudCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGUgY29udGFpbmluZyBkaXJlY3RvcnkgZXhpc3RzIChpbiBjYXNlIHRoaXMgaXMgYSBzeW50aGVzaXplZCBgcGFja2FnZS5qc29uYCBkdWUgdG8gYVxuICAgIC8vIGN1c3RvbSBjb25maWd1cmF0aW9uKSBhbmQgd3JpdGUgdGhlIHVwZGF0ZWQgY29udGVudCB0byBkaXNrLlxuICAgIHRoaXMuZnMuZW5zdXJlRGlyKGRpcm5hbWUocGFja2FnZUpzb25QYXRoKSk7XG4gICAgdGhpcy5mcy53cml0ZUZpbGUocGFja2FnZUpzb25QYXRoLCBgJHtKU09OLnN0cmluZ2lmeShwYXJzZWRKc29uLCBudWxsLCAyKX1cXG5gKTtcbiAgfVxufVxuXG4vLyBIZWxwZXJzXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDaGFuZ2UoXG4gICAgY3R4OiBKc29uT2JqZWN0LCBwcm9wUGF0aDogc3RyaW5nW10sIHZhbHVlOiBKc29uVmFsdWUsXG4gICAgcG9zaXRpb25pbmc6IFBhY2thZ2VKc29uUHJvcGVydHlQb3NpdGlvbmluZyk6IHZvaWQge1xuICBjb25zdCBsYXN0UHJvcElkeCA9IHByb3BQYXRoLmxlbmd0aCAtIDE7XG4gIGNvbnN0IGxhc3RQcm9wID0gcHJvcFBhdGhbbGFzdFByb3BJZHhdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGFzdFByb3BJZHg7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHByb3BQYXRoW2ldO1xuICAgIGNvbnN0IG5ld0N0eCA9IGN0eC5oYXNPd25Qcm9wZXJ0eShrZXkpID8gY3R4W2tleV0gOiAoY3R4W2tleV0gPSB7fSk7XG5cbiAgICBpZiAoKHR5cGVvZiBuZXdDdHggIT09ICdvYmplY3QnKSB8fCAobmV3Q3R4ID09PSBudWxsKSB8fCBBcnJheS5pc0FycmF5KG5ld0N0eCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUHJvcGVydHkgcGF0aCAnJHtwcm9wUGF0aC5qb2luKCcuJyl9JyBkb2VzIG5vdCBwb2ludCB0byBhbiBvYmplY3QuYCk7XG4gICAgfVxuXG4gICAgY3R4ID0gbmV3Q3R4O1xuICB9XG5cbiAgY3R4W2xhc3RQcm9wXSA9IHZhbHVlO1xuICBwb3NpdGlvblByb3BlcnR5KGN0eCwgbGFzdFByb3AsIHBvc2l0aW9uaW5nKTtcbn1cblxuZnVuY3Rpb24gbW92ZVByb3BCZWZvcmUoY3R4OiBKc29uT2JqZWN0LCBwcm9wOiBzdHJpbmcsIGlzTmV4dFByb3A6IChwOiBzdHJpbmcpID0+IGJvb2xlYW4pOiB2b2lkIHtcbiAgY29uc3QgYWxsUHJvcHMgPSBPYmplY3Qua2V5cyhjdHgpO1xuICBjb25zdCBvdGhlclByb3BzID0gYWxsUHJvcHMuZmlsdGVyKHAgPT4gcCAhPT0gcHJvcCk7XG4gIGNvbnN0IG5leHRQcm9wSWR4ID0gb3RoZXJQcm9wcy5maW5kSW5kZXgoaXNOZXh0UHJvcCk7XG4gIGNvbnN0IHByb3BzVG9TaGlmdCA9IChuZXh0UHJvcElkeCA9PT0gLTEpID8gW10gOiBvdGhlclByb3BzLnNsaWNlKG5leHRQcm9wSWR4KTtcblxuICBtb3ZlUHJvcFRvRW5kKGN0eCwgcHJvcCk7XG4gIHByb3BzVG9TaGlmdC5mb3JFYWNoKHAgPT4gbW92ZVByb3BUb0VuZChjdHgsIHApKTtcbn1cblxuZnVuY3Rpb24gbW92ZVByb3BUb0VuZChjdHg6IEpzb25PYmplY3QsIHByb3A6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCB2YWx1ZSA9IGN0eFtwcm9wXTtcbiAgZGVsZXRlIGN0eFtwcm9wXTtcbiAgY3R4W3Byb3BdID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHBvc2l0aW9uUHJvcGVydHkoXG4gICAgY3R4OiBKc29uT2JqZWN0LCBwcm9wOiBzdHJpbmcsIHBvc2l0aW9uaW5nOiBQYWNrYWdlSnNvblByb3BlcnR5UG9zaXRpb25pbmcpOiB2b2lkIHtcbiAgc3dpdGNoIChwb3NpdGlvbmluZykge1xuICAgIGNhc2UgJ2FscGhhYmV0aWMnOlxuICAgICAgbW92ZVByb3BCZWZvcmUoY3R4LCBwcm9wLCBwID0+IHAgPiBwcm9wKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VuaW1wb3J0YW50JzpcbiAgICAgIC8vIExlYXZlIHRoZSBwcm9wZXJ0eSBvcmRlciB1bmNoYW5nZWQ7IGkuZS4gbmV3bHkgYWRkZWQgcHJvcGVydGllcyB3aWxsIGJlIGxhc3QgYW5kIGV4aXN0aW5nXG4gICAgICAvLyBvbmVzIHdpbGwgcmVtYWluIGluIHRoZWlyIG9sZCBwb3NpdGlvbi5cbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBpZiAoKHR5cGVvZiBwb3NpdGlvbmluZyAhPT0gJ29iamVjdCcpIHx8IChwb3NpdGlvbmluZy5iZWZvcmUgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgYFVua25vd24gcG9zaXRpb25pbmcgKCR7SlNPTi5zdHJpbmdpZnkocG9zaXRpb25pbmcpfSkgZm9yIHByb3BlcnR5ICcke3Byb3B9Jy5gKTtcbiAgICAgIH1cblxuICAgICAgbW92ZVByb3BCZWZvcmUoY3R4LCBwcm9wLCBwID0+IHAgPT09IHBvc2l0aW9uaW5nLmJlZm9yZSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuIl19