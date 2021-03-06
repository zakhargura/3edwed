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
        define("@angular/compiler-cli/src/ngtsc/scope/src/api", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ3RzYy9zY29wZS9zcmMvYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1JlZmVyZW5jZX0gZnJvbSAnLi4vLi4vaW1wb3J0cyc7XG5pbXBvcnQge0RpcmVjdGl2ZU1ldGEsIFBpcGVNZXRhfSBmcm9tICcuLi8uLi9tZXRhZGF0YSc7XG5pbXBvcnQge0NsYXNzRGVjbGFyYXRpb259IGZyb20gJy4uLy4uL3JlZmxlY3Rpb24nO1xuXG5cbi8qKlxuICogRGF0YSBmb3Igb25lIG9mIGEgZ2l2ZW4gTmdNb2R1bGUncyBzY29wZXMgKGVpdGhlciBjb21waWxhdGlvbiBzY29wZSBvciBleHBvcnQgc2NvcGVzKS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTY29wZURhdGEge1xuICAvKipcbiAgICogRGlyZWN0aXZlcyBpbiB0aGUgZXhwb3J0ZWQgc2NvcGUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGRpcmVjdGl2ZXM6IERpcmVjdGl2ZU1ldGFbXTtcblxuICAvKipcbiAgICogUGlwZXMgaW4gdGhlIGV4cG9ydGVkIHNjb3BlIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBwaXBlczogUGlwZU1ldGFbXTtcblxuICAvKipcbiAgICogTmdNb2R1bGVzIHdoaWNoIGNvbnRyaWJ1dGVkIHRvIHRoZSBzY29wZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgbmdNb2R1bGVzOiBDbGFzc0RlY2xhcmF0aW9uW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgc29tZSBtb2R1bGUgb3IgY29tcG9uZW50IGluIHRoaXMgc2NvcGUgY29udGFpbnMgZXJyb3JzIGFuZCBpcyB0aHVzIHNlbWFudGljYWxseVxuICAgKiB1bnJlbGlhYmxlLlxuICAgKi9cbiAgaXNQb2lzb25lZDogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBbiBleHBvcnQgc2NvcGUgb2YgYW4gTmdNb2R1bGUsIGNvbnRhaW5pbmcgdGhlIGRpcmVjdGl2ZXMvcGlwZXMgaXQgY29udHJpYnV0ZXMgdG8gb3RoZXIgTmdNb2R1bGVzXG4gKiB3aGljaCBpbXBvcnQgaXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhwb3J0U2NvcGUge1xuICAvKipcbiAgICogVGhlIHNjb3BlIGV4cG9ydGVkIGJ5IGFuIE5nTW9kdWxlLCBhbmQgYXZhaWxhYmxlIGZvciBpbXBvcnQuXG4gICAqL1xuICBleHBvcnRlZDogU2NvcGVEYXRhO1xufVxuXG4vKipcbiAqIEEgcmVzb2x2ZWQgc2NvcGUgZm9yIGEgZ2l2ZW4gY29tcG9uZW50IHRoYXQgY2Fubm90IGJlIHNldCBsb2NhbGx5IGluIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbixcbiAqIGFuZCBtdXN0IGJlIHNldCB2aWEgcmVtb3RlIHNjb3BpbmcgY2FsbCBpbiB0aGUgY29tcG9uZW50J3MgTmdNb2R1bGUgZmlsZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZW1vdGVTY29wZSB7XG4gIC8qKlxuICAgKiBUaG9zZSBkaXJlY3RpdmVzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCB0aGF0IHJlcXVpcmVzIHRoaXMgc2NvcGUgdG8gYmUgc2V0IHJlbW90ZWx5LlxuICAgKi9cbiAgZGlyZWN0aXZlczogUmVmZXJlbmNlW107XG5cbiAgLyoqXG4gICAqIFRob3NlIHBpcGVzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCB0aGF0IHJlcXVpcmVzIHRoaXMgc2NvcGUgdG8gYmUgc2V0IHJlbW90ZWx5LlxuICAgKi9cbiAgcGlwZXM6IFJlZmVyZW5jZVtdO1xufSJdfQ==