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
        define("@angular/compiler-cli/src/ngtsc/core/api/src/public_options", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljX29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL2NvcmUvYXBpL3NyYy9wdWJsaWNfb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBPcHRpb25zIHN1cHBvcnRlZCBieSB0aGUgbGVnYWN5IFZpZXcgRW5naW5lIGNvbXBpbGVyLCB3aGljaCBhcmUgc3RpbGwgY29uc3VtZWQgYnkgdGhlIEFuZ3VsYXIgSXZ5XG4gKiBjb21waWxlciBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gKlxuICogVGhlc2UgYXJlIGV4cGVjdGVkIHRvIGJlIHJlbW92ZWQgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMZWdhY3lOZ2NPcHRpb25zIHtcbiAgLyoqIGdlbmVyYXRlIGFsbCBwb3NzaWJsZSBnZW5lcmF0ZWQgZmlsZXMgICovXG4gIGFsbG93RW1wdHlDb2RlZ2VuRmlsZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHR5cGUgY2hlY2sgdGhlIGVudGlyZSB0ZW1wbGF0ZS5cbiAgICpcbiAgICogVGhpcyBmbGFnIGN1cnJlbnRseSBjb250cm9scyBhIGNvdXBsZSBhc3BlY3RzIG9mIHRlbXBsYXRlIHR5cGUtY2hlY2tpbmcsIGluY2x1ZGluZ1xuICAgKiB3aGV0aGVyIGVtYmVkZGVkIHZpZXdzIGFyZSBjaGVja2VkLlxuICAgKlxuICAgKiBGb3IgbWF4aW11bSB0eXBlLWNoZWNraW5nLCBzZXQgdGhpcyB0byBgdHJ1ZWAsIGFuZCBzZXQgYHN0cmljdFRlbXBsYXRlc2AgdG8gYHRydWVgLlxuICAgKlxuICAgKiBJdCBpcyBhbiBlcnJvciBmb3IgdGhpcyBmbGFnIHRvIGJlIGBmYWxzZWAsIHdoaWxlIGBzdHJpY3RUZW1wbGF0ZXNgIGlzIHNldCB0byBgdHJ1ZWAuXG4gICAqL1xuICBmdWxsVGVtcGxhdGVUeXBlQ2hlY2s/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGdlbmVyYXRlIGEgZmxhdCBtb2R1bGUgaW5kZXggb2YgdGhlIGdpdmVuIG5hbWUgYW5kIHRoZSBjb3JyZXNwb25kaW5nXG4gICAqIGZsYXQgbW9kdWxlIG1ldGFkYXRhLiBUaGlzIG9wdGlvbiBpcyBpbnRlbmRlZCB0byBiZSB1c2VkIHdoZW4gY3JlYXRpbmcgZmxhdFxuICAgKiBtb2R1bGVzIHNpbWlsYXIgdG8gaG93IGBAYW5ndWxhci9jb3JlYCBhbmQgYEBhbmd1bGFyL2NvbW1vbmAgYXJlIHBhY2thZ2VkLlxuICAgKiBXaGVuIHRoaXMgb3B0aW9uIGlzIHVzZWQgdGhlIGBwYWNrYWdlLmpzb25gIGZvciB0aGUgbGlicmFyeSBzaG91bGQgcmVmZXIgdG8gdGhlXG4gICAqIGdlbmVyYXRlZCBmbGF0IG1vZHVsZSBpbmRleCBpbnN0ZWFkIG9mIHRoZSBsaWJyYXJ5IGluZGV4IGZpbGUuIFdoZW4gdXNpbmcgdGhpc1xuICAgKiBvcHRpb24gb25seSBvbmUgLm1ldGFkYXRhLmpzb24gZmlsZSBpcyBwcm9kdWNlZCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgbWV0YWRhdGFcbiAgICogbmVjZXNzYXJ5IGZvciBzeW1ib2xzIGV4cG9ydGVkIGZyb20gdGhlIGxpYnJhcnkgaW5kZXguXG4gICAqIEluIHRoZSBnZW5lcmF0ZWQgLm5nZmFjdG9yeS50cyBmaWxlcyBmbGF0IG1vZHVsZSBpbmRleCBpcyB1c2VkIHRvIGltcG9ydCBzeW1ib2xzXG4gICAqIGluY2x1ZGluZyBib3RoIHRoZSBwdWJsaWMgQVBJIGZyb20gdGhlIGxpYnJhcnkgaW5kZXggYXMgd2VsbCBhcyBzaHJvd2RlZCBpbnRlcm5hbFxuICAgKiBzeW1ib2xzLlxuICAgKiBCeSBkZWZhdWx0IHRoZSAudHMgZmlsZSBzdXBwbGllZCBpbiB0aGUgYGZpbGVzYCBmaWVsZCBpcyBhc3N1bWVkIHRvIGJlIHRoZVxuICAgKiBsaWJyYXJ5IGluZGV4LiBJZiBtb3JlIHRoYW4gb25lIGlzIHNwZWNpZmllZCwgdXNlcyBgbGlicmFyeUluZGV4YCB0byBzZWxlY3QgdGhlXG4gICAqIGZpbGUgdG8gdXNlLiBJZiBtb3JlIHRoYW4gb25lIC50cyBmaWxlIGlzIHN1cHBsaWVkIGFuZCBubyBgbGlicmFyeUluZGV4YCBpcyBzdXBwbGllZFxuICAgKiBhbiBlcnJvciBpcyBwcm9kdWNlZC5cbiAgICogQSBmbGF0IG1vZHVsZSBpbmRleCAuZC50cyBhbmQgLmpzIHdpbGwgYmUgY3JlYXRlZCB3aXRoIHRoZSBnaXZlbiBgZmxhdE1vZHVsZU91dEZpbGVgXG4gICAqIG5hbWUgaW4gdGhlIHNhbWUgbG9jYXRpb24gYXMgdGhlIGxpYnJhcnkgaW5kZXggLmQudHMgZmlsZSBpcyBlbWl0dGVkLlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgYSBsaWJyYXJ5IHVzZXMgYHB1YmxpY19hcGkudHNgIGZpbGUgYXMgdGhlIGxpYnJhcnkgaW5kZXggb2YgdGhlXG4gICAqIG1vZHVsZSB0aGUgYHRzY29uZmlnLmpzb25gIGBmaWxlc2AgZmllbGQgd291bGQgYmUgYFtcInB1YmxpY19hcGkudHNcIl1gLiBUaGVcbiAgICogYGZsYXRNb2R1bGVPdXRGaWxlYCBvcHRpb25zIGNvdWxkIHRoZW4gYmUgc2V0IHRvLCBmb3IgZXhhbXBsZSBgXCJpbmRleC5qc1wiYCwgd2hpY2hcbiAgICogcHJvZHVjZXMgYGluZGV4LmQudHNgIGFuZCAgYGluZGV4Lm1ldGFkYXRhLmpzb25gIGZpbGVzLiBUaGUgbGlicmFyeSdzXG4gICAqIGBwYWNrYWdlLmpzb25gJ3MgYG1vZHVsZWAgZmllbGQgd291bGQgYmUgYFwiaW5kZXguanNcImAgYW5kIHRoZSBgdHlwaW5nc2AgZmllbGQgd291bGRcbiAgICogYmUgYFwiaW5kZXguZC50c1wiYC5cbiAgICovXG4gIGZsYXRNb2R1bGVPdXRGaWxlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcmVmZXJyZWQgbW9kdWxlIGlkIHRvIHVzZSBmb3IgaW1wb3J0aW5nIGZsYXQgbW9kdWxlLiBSZWZlcmVuY2VzIGdlbmVyYXRlZCBieSBgbmdjYFxuICAgKiB3aWxsIHVzZSB0aGlzIG1vZHVsZSBuYW1lIHdoZW4gaW1wb3J0aW5nIHN5bWJvbHMgZnJvbSB0aGUgZmxhdCBtb2R1bGUuIFRoaXMgaXMgb25seVxuICAgKiBtZWFuaW5nZnVsIHdoZW4gYGZsYXRNb2R1bGVPdXRGaWxlYCBpcyBhbHNvIHN1cHBsaWVkLiBJdCBpcyBvdGhlcndpc2UgaWdub3JlZC5cbiAgICovXG4gIGZsYXRNb2R1bGVJZD86IHN0cmluZztcblxuICAvKipcbiAgICogQWx3YXlzIHJlcG9ydCBlcnJvcnMgYSBwYXJhbWV0ZXIgaXMgc3VwcGxpZWQgd2hvc2UgaW5qZWN0aW9uIHR5cGUgY2Fubm90XG4gICAqIGJlIGRldGVybWluZWQuIFdoZW4gdGhpcyB2YWx1ZSBvcHRpb24gaXMgbm90IHByb3ZpZGVkIG9yIGlzIGBmYWxzZWAsIGNvbnN0cnVjdG9yXG4gICAqIHBhcmFtZXRlcnMgb2YgY2xhc3NlcyBtYXJrZWQgd2l0aCBgQEluamVjdGFibGVgIHdob3NlIHR5cGUgY2Fubm90IGJlIHJlc29sdmVkIHdpbGxcbiAgICogcHJvZHVjZSBhIHdhcm5pbmcuIFdpdGggdGhpcyBvcHRpb24gYHRydWVgLCB0aGV5IHByb2R1Y2UgYW4gZXJyb3IuIFdoZW4gdGhpcyBvcHRpb24gaXNcbiAgICogbm90IHByb3ZpZGVkIGlzIHRyZWF0ZWQgYXMgaWYgaXQgd2VyZSBgZmFsc2VgLlxuICAgKi9cbiAgc3RyaWN0SW5qZWN0aW9uUGFyYW1ldGVycz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gcmVtb3ZlIGJsYW5rIHRleHQgbm9kZXMgZnJvbSBjb21waWxlZCB0ZW1wbGF0ZXMuIEl0IGlzIGBmYWxzZWAgYnkgZGVmYXVsdCBzdGFydGluZ1xuICAgKiBmcm9tIEFuZ3VsYXIgNi5cbiAgICovXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hpY2ggd2VyZSBhZGRlZCB0byB0aGUgQW5ndWxhciBJdnkgY29tcGlsZXIgdG8gc3VwcG9ydCBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoXG4gKiBleGlzdGluZyBWaWV3IEVuZ2luZSBhcHBsaWNhdGlvbnMuXG4gKlxuICogVGhlc2UgYXJlIGV4cGVjdGVkIHRvIGJlIHJlbW92ZWQgYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2NDb21wYXRpYmlsaXR5T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb250cm9scyB3aGV0aGVyIG5ndHNjIHdpbGwgZW1pdCBgLm5nZmFjdG9yeS5qc2Agc2hpbXMgZm9yIGVhY2ggY29tcGlsZWQgYC50c2AgZmlsZS5cbiAgICpcbiAgICogVGhlc2Ugc2hpbXMgc3VwcG9ydCBsZWdhY3kgaW1wb3J0cyBmcm9tIGBuZ2ZhY3RvcnlgIGZpbGVzLCBieSBleHBvcnRpbmcgYSBmYWN0b3J5IHNoaW1cbiAgICogZm9yIGVhY2ggY29tcG9uZW50IG9yIE5nTW9kdWxlIGluIHRoZSBvcmlnaW5hbCBgLnRzYCBmaWxlLlxuICAgKi9cbiAgZ2VuZXJhdGVOZ0ZhY3RvcnlTaGltcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgbmd0c2Mgd2lsbCBlbWl0IGAubmdzdW1tYXJ5LmpzYCBzaGltcyBmb3IgZWFjaCBjb21waWxlZCBgLnRzYCBmaWxlLlxuICAgKlxuICAgKiBUaGVzZSBzaGltcyBzdXBwb3J0IGxlZ2FjeSBpbXBvcnRzIGZyb20gYG5nc3VtbWFyeWAgZmlsZXMsIGJ5IGV4cG9ydGluZyBhbiBlbXB0eSBvYmplY3RcbiAgICogZm9yIGVhY2ggTmdNb2R1bGUgaW4gdGhlIG9yaWdpbmFsIGAudHNgIGZpbGUuIFRoZSBvbmx5IHB1cnBvc2Ugb2Ygc3VtbWFyaWVzIGlzIHRvIGZlZWQgdGhlbSB0b1xuICAgKiBgVGVzdEJlZGAsIHdoaWNoIGlzIGEgbm8tb3AgaW4gSXZ5LlxuICAgKi9cbiAgZ2VuZXJhdGVOZ1N1bW1hcnlTaGltcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRlbGxzIHRoZSBjb21waWxlciB0byBnZW5lcmF0ZSBkZWZpbml0aW9ucyB1c2luZyB0aGUgUmVuZGVyMyBzdHlsZSBjb2RlIGdlbmVyYXRpb24uXG4gICAqIFRoaXMgb3B0aW9uIGRlZmF1bHRzIHRvIGB0cnVlYC5cbiAgICpcbiAgICogQWNjZXB0YWJsZSB2YWx1ZXMgYXJlIGFzIGZvbGxvd3M6XG4gICAqXG4gICAqIGBmYWxzZWAgLSBydW4gbmdjIG5vcm1hbGx5XG4gICAqIGB0cnVlYCAtIHJ1biB0aGUgbmd0c2MgY29tcGlsZXIgaW5zdGVhZCBvZiB0aGUgbm9ybWFsIG5nYyBjb21waWxlclxuICAgKiBgbmd0c2NgIC0gYWxpYXMgZm9yIGB0cnVlYFxuICAgKi9cbiAgZW5hYmxlSXZ5PzogYm9vbGVhbnwnbmd0c2MnO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgcmVsYXRlZCB0byB0ZW1wbGF0ZSB0eXBlLWNoZWNraW5nIGFuZCBpdHMgc3RyaWN0bmVzcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RyaWN0VGVtcGxhdGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgaW1wbGllcyBhbGwgdGVtcGxhdGUgc3RyaWN0bmVzcyBmbGFncyBiZWxvdyAodW5sZXNzIGluZGl2aWR1YWxseSBkaXNhYmxlZCkuXG4gICAqXG4gICAqIFRoaXMgZmxhZyBpcyBhIHN1cGVyc2V0IG9mIGBmdWxsVGVtcGxhdGVUeXBlQ2hlY2tgLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLCBldmVuIGlmIFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgaXMgYHRydWVgLlxuICAgKi9cbiAgc3RyaWN0VGVtcGxhdGVzPzogYm9vbGVhbjtcblxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNoZWNrIHRoZSB0eXBlIG9mIGEgYmluZGluZyB0byBhIGRpcmVjdGl2ZS9jb21wb25lbnQgaW5wdXQgYWdhaW5zdCB0aGUgdHlwZSBvZiB0aGVcbiAgICogZmllbGQgb24gdGhlIGRpcmVjdGl2ZS9jb21wb25lbnQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpZiB0aGlzIGlzIGBmYWxzZWAgdGhlbiB0aGUgZXhwcmVzc2lvbiBgW2lucHV0XT1cImV4cHJcImAgd2lsbCBoYXZlIGBleHByYCB0eXBlLVxuICAgKiBjaGVja2VkLCBidXQgbm90IHRoZSBhc3NpZ25tZW50IG9mIHRoZSByZXN1bHRpbmcgdHlwZSB0byB0aGUgYGlucHV0YCBwcm9wZXJ0eSBvZiB3aGljaGV2ZXJcbiAgICogZGlyZWN0aXZlIG9yIGNvbXBvbmVudCBpcyByZWNlaXZpbmcgdGhlIGJpbmRpbmcuIElmIHNldCB0byBgdHJ1ZWAsIGJvdGggc2lkZXMgb2YgdGhlIGFzc2lnbm1lbnRcbiAgICogYXJlIGNoZWNrZWQuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAsIGV2ZW4gaWYgXCJmdWxsVGVtcGxhdGVUeXBlQ2hlY2tcIiBpcyBzZXQuXG4gICAqL1xuICBzdHJpY3RJbnB1dFR5cGVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjaGVjayBpZiB0aGUgaW5wdXQgYmluZGluZyBhdHRlbXB0cyB0byBhc3NpZ24gdG8gYSByZXN0cmljdGVkIGZpZWxkIChyZWFkb25seSxcbiAgICogcHJpdmF0ZSwgb3IgcHJvdGVjdGVkKSBvbiB0aGUgZGlyZWN0aXZlL2NvbXBvbmVudC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYCwgZXZlbiBpZiBcImZ1bGxUZW1wbGF0ZVR5cGVDaGVja1wiLCBcInN0cmljdFRlbXBsYXRlc1wiIGFuZC9vclxuICAgKiBcInN0cmljdElucHV0VHlwZXNcIiBpcyBzZXQuIE5vdGUgdGhhdCBpZiBgc3RyaWN0SW5wdXRUeXBlc2AgaXMgbm90IHNldCwgb3Igc2V0IHRvIGBmYWxzZWAsIHRoaXNcbiAgICogZmxhZyBoYXMgbm8gZWZmZWN0LlxuICAgKlxuICAgKiBUcmFja2luZyBpc3N1ZSBmb3IgZW5hYmxpbmcgdGhpcyBieSBkZWZhdWx0OiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zODQwMFxuICAgKi9cbiAgc3RyaWN0SW5wdXRBY2Nlc3NNb2RpZmllcnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSBzdHJpY3QgbnVsbCB0eXBlcyBmb3IgaW5wdXQgYmluZGluZ3MgZm9yIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgYHRydWVgLCBhcHBsaWNhdGlvbnMgdGhhdCBhcmUgY29tcGlsZWQgd2l0aCBUeXBlU2NyaXB0J3MgYHN0cmljdE51bGxDaGVja3NgIGVuYWJsZWRcbiAgICogd2lsbCBwcm9kdWNlIHR5cGUgZXJyb3JzIGZvciBiaW5kaW5ncyB3aGljaCBjYW4gZXZhbHVhdGUgdG8gYHVuZGVmaW5lZGAgb3IgYG51bGxgIHdoZXJlIHRoZVxuICAgKiBpbnB1dHMncyB0eXBlIGRvZXMgbm90IGluY2x1ZGUgYHVuZGVmaW5lZGAgb3IgYG51bGxgIGluIGl0cyB0eXBlLiBJZiBzZXQgdG8gYGZhbHNlYCwgYWxsXG4gICAqIGJpbmRpbmcgZXhwcmVzc2lvbnMgYXJlIHdyYXBwZWQgaW4gYSBub24tbnVsbCBhc3NlcnRpb24gb3BlcmF0b3IgdG8gZWZmZWN0aXZlbHkgZGlzYWJsZSBzdHJpY3RcbiAgICogbnVsbCBjaGVja3MuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAsIGV2ZW4gaWYgXCJmdWxsVGVtcGxhdGVUeXBlQ2hlY2tcIiBpcyBzZXQuIE5vdGUgdGhhdCBpZiBgc3RyaWN0SW5wdXRUeXBlc2AgaXNcbiAgICogbm90IHNldCwgb3Igc2V0IHRvIGBmYWxzZWAsIHRoaXMgZmxhZyBoYXMgbm8gZWZmZWN0LlxuICAgKi9cbiAgc3RyaWN0TnVsbElucHV0VHlwZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNoZWNrIHRleHQgYXR0cmlidXRlcyB0aGF0IGhhcHBlbiB0byBiZSBjb25zdW1lZCBieSBhIGRpcmVjdGl2ZSBvciBjb21wb25lbnQuXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCBpbiBhIHRlbXBsYXRlIGNvbnRhaW5pbmcgYDxpbnB1dCBtYXRJbnB1dCBkaXNhYmxlZD5gIHRoZSBgZGlzYWJsZWRgIGF0dHJpYnV0ZSBlbmRzXG4gICAqIHVwIGJlaW5nIGNvbnN1bWVkIGFzIGFuIGlucHV0IHdpdGggdHlwZSBgYm9vbGVhbmAgYnkgdGhlIGBtYXRJbnB1dGAgZGlyZWN0aXZlLiBBdCBydW50aW1lLCB0aGVcbiAgICogaW5wdXQgd2lsbCBiZSBzZXQgdG8gdGhlIGF0dHJpYnV0ZSdzIHN0cmluZyB2YWx1ZSwgd2hpY2ggaXMgYW4gZW1wdHkgc3RyaW5nIGZvciBhdHRyaWJ1dGVzXG4gICAqIHdpdGhvdXQgYSB2YWx1ZSwgc28gd2l0aCB0aGlzIGZsYWcgc2V0IHRvIGB0cnVlYCwgYW4gZXJyb3Igd291bGQgYmUgcmVwb3J0ZWQuIElmIHNldCB0b1xuICAgKiBgZmFsc2VgLCB0ZXh0IGF0dHJpYnV0ZXMgd2lsbCBuZXZlciByZXBvcnQgYW4gZXJyb3IuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAsIGV2ZW4gaWYgXCJmdWxsVGVtcGxhdGVUeXBlQ2hlY2tcIiBpcyBzZXQuIE5vdGUgdGhhdCBpZiBgc3RyaWN0SW5wdXRUeXBlc2AgaXNcbiAgICogbm90IHNldCwgb3Igc2V0IHRvIGBmYWxzZWAsIHRoaXMgZmxhZyBoYXMgbm8gZWZmZWN0LlxuICAgKi9cbiAgc3RyaWN0QXR0cmlidXRlVHlwZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHVzZSBhIHN0cmljdCB0eXBlIGZvciBudWxsLXNhZmUgbmF2aWdhdGlvbiBvcGVyYXRpb25zLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGBmYWxzZWAsIHRoZW4gdGhlIHJldHVybiB0eXBlIG9mIGBhPy5iYCBvciBgYT8oKWAgd2lsbCBiZSBgYW55YC4gSWYgc2V0IHRvIGB0cnVlYCxcbiAgICogdGhlbiB0aGUgcmV0dXJuIHR5cGUgb2YgYGE/LmJgIGZvciBleGFtcGxlIHdpbGwgYmUgdGhlIHNhbWUgYXMgdGhlIHR5cGUgb2YgdGhlIHRlcm5hcnlcbiAgICogZXhwcmVzc2lvbiBgYSAhPSBudWxsID8gYS5iIDogYWAuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAsIGV2ZW4gaWYgXCJmdWxsVGVtcGxhdGVUeXBlQ2hlY2tcIiBpcyBzZXQuXG4gICAqL1xuICBzdHJpY3RTYWZlTmF2aWdhdGlvblR5cGVzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBpbmZlciB0aGUgdHlwZSBvZiBsb2NhbCByZWZlcmVuY2VzLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGB0cnVlYCwgdGhlIHR5cGUgb2YgYSBgI3JlZmAgdmFyaWFibGUgb24gYSBET00gbm9kZSBpbiB0aGUgdGVtcGxhdGUgd2lsbCBiZVxuICAgKiBkZXRlcm1pbmVkIGJ5IHRoZSB0eXBlIG9mIGBkb2N1bWVudC5jcmVhdGVFbGVtZW50YCBmb3IgdGhlIGdpdmVuIERPTSBub2RlLiBJZiBzZXQgdG8gYGZhbHNlYCxcbiAgICogdGhlIHR5cGUgb2YgYHJlZmAgZm9yIERPTSBub2RlcyB3aWxsIGJlIGBhbnlgLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLCBldmVuIGlmIFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgaXMgc2V0LlxuICAgKi9cbiAgc3RyaWN0RG9tTG9jYWxSZWZUeXBlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW5mZXIgdGhlIHR5cGUgb2YgdGhlIGAkZXZlbnRgIHZhcmlhYmxlIGluIGV2ZW50IGJpbmRpbmdzIGZvciBkaXJlY3RpdmUgb3V0cHV0cyBvclxuICAgKiBhbmltYXRpb24gZXZlbnRzLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGB0cnVlYCwgdGhlIHR5cGUgb2YgYCRldmVudGAgd2lsbCBiZSBpbmZlcnJlZCBiYXNlZCBvbiB0aGUgZ2VuZXJpYyB0eXBlIG9mXG4gICAqIGBFdmVudEVtaXR0ZXJgL2BTdWJqZWN0YCBvZiB0aGUgb3V0cHV0LiBJZiBzZXQgdG8gYGZhbHNlYCwgdGhlIGAkZXZlbnRgIHZhcmlhYmxlIHdpbGwgYmUgb2ZcbiAgICogdHlwZSBgYW55YC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYGZhbHNlYCwgZXZlbiBpZiBcImZ1bGxUZW1wbGF0ZVR5cGVDaGVja1wiIGlzIHNldC5cbiAgICovXG4gIHN0cmljdE91dHB1dEV2ZW50VHlwZXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGluZmVyIHRoZSB0eXBlIG9mIHRoZSBgJGV2ZW50YCB2YXJpYWJsZSBpbiBldmVudCBiaW5kaW5ncyB0byBET00gZXZlbnRzLlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIGB0cnVlYCwgdGhlIHR5cGUgb2YgYCRldmVudGAgd2lsbCBiZSBpbmZlcnJlZCBiYXNlZCBvbiBUeXBlU2NyaXB0J3NcbiAgICogYEhUTUxFbGVtZW50RXZlbnRNYXBgLCB3aXRoIGEgZmFsbGJhY2sgdG8gdGhlIG5hdGl2ZSBgRXZlbnRgIHR5cGUuIElmIHNldCB0byBgZmFsc2VgLCB0aGVcbiAgICogYCRldmVudGAgdmFyaWFibGUgd2lsbCBiZSBvZiB0eXBlIGBhbnlgLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgLCBldmVuIGlmIFwiZnVsbFRlbXBsYXRlVHlwZUNoZWNrXCIgaXMgc2V0LlxuICAgKi9cbiAgc3RyaWN0RG9tRXZlbnRUeXBlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW5jbHVkZSB0aGUgZ2VuZXJpYyB0eXBlIG9mIGNvbXBvbmVudHMgd2hlbiB0eXBlLWNoZWNraW5nIHRoZSB0ZW1wbGF0ZS5cbiAgICpcbiAgICogSWYgbm8gY29tcG9uZW50IGhhcyBnZW5lcmljIHR5cGUgcGFyYW1ldGVycywgdGhpcyBzZXR0aW5nIGhhcyBubyBlZmZlY3QuXG4gICAqXG4gICAqIElmIGEgY29tcG9uZW50IGhhcyBnZW5lcmljIHR5cGUgcGFyYW1ldGVycyBhbmQgdGhpcyBzZXR0aW5nIGlzIGB0cnVlYCwgdGhvc2UgZ2VuZXJpYyBwYXJhbWV0ZXJzXG4gICAqIHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIGNvbnRleHQgdHlwZSBmb3IgdGhlIHRlbXBsYXRlLiBJZiBgZmFsc2VgLCBhbnkgZ2VuZXJpYyBwYXJhbWV0ZXJzIHdpbGxcbiAgICogYmUgc2V0IHRvIGBhbnlgIGluIHRoZSB0ZW1wbGF0ZSBjb250ZXh0IHR5cGUuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIGBmYWxzZWAsIGV2ZW4gaWYgXCJmdWxsVGVtcGxhdGVUeXBlQ2hlY2tcIiBpcyBzZXQuXG4gICAqL1xuICBzdHJpY3RDb250ZXh0R2VuZXJpY3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIG9iamVjdCBvciBhcnJheSBsaXRlcmFscyBkZWZpbmVkIGluIHRlbXBsYXRlcyB1c2UgdGhlaXIgaW5mZXJyZWQgdHlwZSwgb3IgYXJlXG4gICAqIGludGVycHJldGVkIGFzIGBhbnlgLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBgZmFsc2VgIHVubGVzcyBgZnVsbFRlbXBsYXRlVHlwZUNoZWNrYCBvciBgc3RyaWN0VGVtcGxhdGVzYCBhcmUgc2V0LlxuICAgKi9cbiAgc3RyaWN0TGl0ZXJhbFR5cGVzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoaWNoIGNvbnRyb2wgYmVoYXZpb3IgdXNlZnVsIGZvciBcIm1vbm9yZXBvXCIgYnVpbGQgY2FzZXMgdXNpbmcgQmF6ZWwgKHN1Y2ggYXMgdGhlXG4gKiBpbnRlcm5hbCBHb29nbGUgbW9ub3JlcG8sIGczKS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQmF6ZWxBbmRHM09wdGlvbnMge1xuICAvKipcbiAgICogRW5hYmxlcyB0aGUgZ2VuZXJhdGlvbiBvZiBhbGlhcyByZS1leHBvcnRzIG9mIGRpcmVjdGl2ZXMvcGlwZXMgdGhhdCBhcmUgdmlzaWJsZSBmcm9tIGFuXG4gICAqIE5nTW9kdWxlIGZyb20gdGhhdCBOZ01vZHVsZSdzIGZpbGUuXG4gICAqXG4gICAqIFRoaXMgb3B0aW9uIHNob3VsZCBiZSBkaXNhYmxlZCBmb3IgYXBwbGljYXRpb24gYnVpbGRzIG9yIGZvciBBbmd1bGFyIFBhY2thZ2UgRm9ybWF0IGxpYnJhcmllc1xuICAgKiAod2hlcmUgTmdNb2R1bGVzIGFsb25nIHdpdGggdGhlaXIgZGlyZWN0aXZlcy9waXBlcyBhcmUgZXhwb3J0ZWQgdmlhIGEgc2luZ2xlIGVudHJ5cG9pbnQpLlxuICAgKlxuICAgKiBGb3Igb3RoZXIgbGlicmFyeSBjb21waWxhdGlvbnMgd2hpY2ggYXJlIGludGVuZGVkIHRvIGJlIHBhdGgtbWFwcGVkIGludG8gYW4gYXBwbGljYXRpb24gYnVpbGRcbiAgICogKG9yIGFub3RoZXIgbGlicmFyeSksIGVuYWJsaW5nIHRoaXMgb3B0aW9uIGVuYWJsZXMgdGhlIHJlc3VsdGluZyBkZWVwIGltcG9ydHMgdG8gd29ya1xuICAgKiBjb3JyZWN0bHkuXG4gICAqXG4gICAqIEEgY29uc3VtZXIgb2Ygc3VjaCBhIHBhdGgtbWFwcGVkIGxpYnJhcnkgd2lsbCB3cml0ZSBhbiBpbXBvcnQgbGlrZTpcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBpbXBvcnQge0xpYk1vZHVsZX0gZnJvbSAnbGliL2RlZXAvcGF0aC90by9tb2R1bGUnO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIGNvbXBpbGVyIHdpbGwgYXR0ZW1wdCB0byBnZW5lcmF0ZSBpbXBvcnRzIG9mIGRpcmVjdGl2ZXMvcGlwZXMgZnJvbSB0aGF0IHNhbWUgbW9kdWxlXG4gICAqIHNwZWNpZmllciAodGhlIGNvbXBpbGVyIGRvZXMgbm90IHJld3JpdGUgdGhlIHVzZXIncyBnaXZlbiBpbXBvcnQgcGF0aCwgdW5saWtlIFZpZXcgRW5naW5lKS5cbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBpbXBvcnQge0xpYkRpciwgTGliQ21wLCBMaWJQaXBlfSBmcm9tICdsaWIvZGVlcC9wYXRoL3RvL21vZHVsZSc7XG4gICAqIGBgYFxuICAgKlxuICAgKiBJdCB3b3VsZCBiZSBidXJkZW5zb21lIGZvciB1c2VycyB0byBoYXZlIHRvIHJlLWV4cG9ydCBhbGwgZGlyZWN0aXZlcy9waXBlcyBhbG9uZ3NpZGUgZWFjaFxuICAgKiBOZ01vZHVsZSB0byBzdXBwb3J0IHRoaXMgaW1wb3J0IG1vZGVsLiBFbmFibGluZyB0aGlzIG9wdGlvbiB0ZWxscyB0aGUgY29tcGlsZXIgdG8gZ2VuZXJhdGVcbiAgICogcHJpdmF0ZSByZS1leHBvcnRzIGFsb25nc2lkZSB0aGUgTmdNb2R1bGUgb2YgYWxsIHRoZSBkaXJlY3RpdmVzL3BpcGVzIGl0IG1ha2VzIGF2YWlsYWJsZSwgdG9cbiAgICogc3VwcG9ydCB0aGVzZSBmdXR1cmUgaW1wb3J0cy5cbiAgICovXG4gIGdlbmVyYXRlRGVlcFJlZXhwb3J0cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEluc2VydCBKU0RvYyB0eXBlIGFubm90YXRpb25zIG5lZWRlZCBieSBDbG9zdXJlIENvbXBpbGVyXG4gICAqL1xuICBhbm5vdGF0ZUZvckNsb3N1cmVDb21waWxlcj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyByZWxhdGVkIHRvIGkxOG4gY29tcGlsYXRpb24gc3VwcG9ydC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSTE4bk9wdGlvbnMge1xuICAvKipcbiAgICogTG9jYWxlIG9mIHRoZSBpbXBvcnRlZCB0cmFuc2xhdGlvbnNcbiAgICovXG4gIGkxOG5JbkxvY2FsZT86IHN0cmluZztcblxuICAvKipcbiAgICogUmVuZGVyIGAkbG9jYWxpemVgIG1lc3NhZ2VzIHdpdGggbGVnYWN5IGZvcm1hdCBpZHMuXG4gICAqXG4gICAqIFRoaXMgaXMgb25seSBhY3RpdmUgaWYgd2UgYXJlIGJ1aWxkaW5nIHdpdGggYGVuYWJsZUl2eTogdHJ1ZWAuXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGZvciBub3cgaXMgYHRydWVgLlxuICAgKlxuICAgKiBVc2UgdGhpcyBvcHRpb24gd2hlbiB1c2UgYXJlIHVzaW5nIHRoZSBgJGxvY2FsaXplYCBiYXNlZCBsb2NhbGl6YXRpb24gbWVzc2FnZXMgYnV0XG4gICAqIGhhdmUgbm90IG1pZ3JhdGVkIHRoZSB0cmFuc2xhdGlvbiBmaWxlcyB0byB1c2UgdGhlIG5ldyBgJGxvY2FsaXplYCBtZXNzYWdlIGlkIGZvcm1hdC5cbiAgICovXG4gIGVuYWJsZUkxOG5MZWdhY3lNZXNzYWdlSWRGb3JtYXQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRyYW5zbGF0aW9uIHZhcmlhYmxlIG5hbWUgc2hvdWxkIGNvbnRhaW4gZXh0ZXJuYWwgbWVzc2FnZSBpZFxuICAgKiAodXNlZCBieSBDbG9zdXJlIENvbXBpbGVyJ3Mgb3V0cHV0IG9mIGBnb29nLmdldE1zZ2AgZm9yIHRyYW5zaXRpb24gcGVyaW9kKVxuICAgKi9cbiAgaTE4blVzZUV4dGVybmFsSWRzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgdGVtcGxhdGVzIGFyZSBzdG9yZWQgaW4gZXh0ZXJuYWwgZmlsZXMgKGUuZy4gdmlhIGB0ZW1wbGF0ZVVybGApIHRoZW4gd2UgbmVlZCB0byBkZWNpZGVcbiAgICogd2hldGhlciBvciBub3QgdG8gbm9ybWFsaXplIHRoZSBsaW5lLWVuZGluZ3MgKGZyb20gYFxcclxcbmAgdG8gYFxcbmApIHdoZW4gcHJvY2Vzc2luZyBJQ1VcbiAgICogZXhwcmVzc2lvbnMuXG4gICAqXG4gICAqIElkZWFsbHkgd2Ugd291bGQgYWx3YXlzIG5vcm1hbGl6ZSwgYnV0IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IHRoaXMgZmxhZyBhbGxvd3MgdGhlIHRlbXBsYXRlXG4gICAqIHBhcnNlciB0byBhdm9pZCBub3JtYWxpemluZyBsaW5lIGVuZGluZ3MgaW4gSUNVIGV4cHJlc3Npb25zLlxuICAgKlxuICAgKiBJZiBgdHJ1ZWAgdGhlbiB3ZSB3aWxsIG5vcm1hbGl6ZSBJQ1UgZXhwcmVzc2lvbiBsaW5lIGVuZGluZ3MuXG4gICAqIFRoZSBkZWZhdWx0IGlzIGBmYWxzZWAsIGJ1dCB0aGlzIHdpbGwgYmUgc3dpdGNoZWQgaW4gYSBmdXR1cmUgbWFqb3IgcmVsZWFzZS5cbiAgICovXG4gIGkxOG5Ob3JtYWxpemVMaW5lRW5kaW5nc0luSUNVcz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogTWlzY2VsbGFuZW91cyBvcHRpb25zIHRoYXQgZG9uJ3QgZmFsbCBpbnRvIGFueSBvdGhlciBjYXRlZ29yeVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNaXNjT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBjb21waWxlciBzaG91bGQgYXZvaWQgZ2VuZXJhdGluZyBjb2RlIGZvciBjbGFzc2VzIHRoYXQgaGF2ZW4ndCBiZWVuIGV4cG9ydGVkLlxuICAgKiBUaGlzIGlzIG9ubHkgYWN0aXZlIHdoZW4gYnVpbGRpbmcgd2l0aCBgZW5hYmxlSXZ5OiB0cnVlYC4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAgKi9cbiAgY29tcGlsZU5vbkV4cG9ydGVkQ2xhc3Nlcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERpc2FibGUgVHlwZVNjcmlwdCBWZXJzaW9uIENoZWNrLlxuICAgKi9cbiAgZGlzYWJsZVR5cGVTY3JpcHRWZXJzaW9uQ2hlY2s/OiBib29sZWFuO1xufVxuIl19