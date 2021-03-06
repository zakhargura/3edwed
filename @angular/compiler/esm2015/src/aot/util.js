/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const STRIP_SRC_FILE_SUFFIXES = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
const GENERATED_FILE = /\.ngfactory\.|\.ngsummary\./;
const JIT_SUMMARY_FILE = /\.ngsummary\./;
const JIT_SUMMARY_NAME = /NgSummary$/;
export function ngfactoryFilePath(filePath, forceSourceFile = false) {
    const urlWithSuffix = splitTypescriptSuffix(filePath, forceSourceFile);
    return `${urlWithSuffix[0]}.ngfactory${normalizeGenFileSuffix(urlWithSuffix[1])}`;
}
export function stripGeneratedFileSuffix(filePath) {
    return filePath.replace(GENERATED_FILE, '.');
}
export function isGeneratedFile(filePath) {
    return GENERATED_FILE.test(filePath);
}
export function splitTypescriptSuffix(path, forceSourceFile = false) {
    if (path.endsWith('.d.ts')) {
        return [path.slice(0, -5), forceSourceFile ? '.ts' : '.d.ts'];
    }
    const lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
        return [path.substring(0, lastDot), path.substring(lastDot)];
    }
    return [path, ''];
}
export function normalizeGenFileSuffix(srcFileSuffix) {
    return srcFileSuffix === '.tsx' ? '.ts' : srcFileSuffix;
}
export function summaryFileName(fileName) {
    const fileNameWithoutSuffix = fileName.replace(STRIP_SRC_FILE_SUFFIXES, '');
    return `${fileNameWithoutSuffix}.ngsummary.json`;
}
export function summaryForJitFileName(fileName, forceSourceFile = false) {
    const urlWithSuffix = splitTypescriptSuffix(stripGeneratedFileSuffix(fileName), forceSourceFile);
    return `${urlWithSuffix[0]}.ngsummary${urlWithSuffix[1]}`;
}
export function stripSummaryForJitFileSuffix(filePath) {
    return filePath.replace(JIT_SUMMARY_FILE, '.');
}
export function summaryForJitName(symbolName) {
    return `${symbolName}NgSummary`;
}
export function stripSummaryForJitNameSuffix(symbolName) {
    return symbolName.replace(JIT_SUMMARY_NAME, '');
}
const LOWERED_SYMBOL = /\u0275\d+/;
export function isLoweredSymbol(name) {
    return LOWERED_SYMBOL.test(name);
}
export function createLoweredSymbol(id) {
    return `\u0275${id}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9hb3QvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxNQUFNLHVCQUF1QixHQUFHLGtDQUFrQyxDQUFDO0FBQ25FLE1BQU0sY0FBYyxHQUFHLDZCQUE2QixDQUFDO0FBQ3JELE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO0FBQ3pDLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDO0FBRXRDLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLGVBQWUsR0FBRyxLQUFLO0lBQ3pFLE1BQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RSxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxhQUFhLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDcEYsQ0FBQztBQUVELE1BQU0sVUFBVSx3QkFBd0IsQ0FBQyxRQUFnQjtJQUN2RCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLENBQUM7QUFFRCxNQUFNLFVBQVUsZUFBZSxDQUFDLFFBQWdCO0lBQzlDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUFDLElBQVksRUFBRSxlQUFlLEdBQUcsS0FBSztJQUN6RSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQy9EO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV0QyxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQzlEO0lBRUQsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwQixDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUFDLGFBQXFCO0lBQzFELE9BQU8sYUFBYSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDMUQsQ0FBQztBQUVELE1BQU0sVUFBVSxlQUFlLENBQUMsUUFBZ0I7SUFDOUMsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLE9BQU8sR0FBRyxxQkFBcUIsaUJBQWlCLENBQUM7QUFDbkQsQ0FBQztBQUVELE1BQU0sVUFBVSxxQkFBcUIsQ0FBQyxRQUFnQixFQUFFLGVBQWUsR0FBRyxLQUFLO0lBQzdFLE1BQU0sYUFBYSxHQUFHLHFCQUFxQixDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2pHLE9BQU8sR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLGFBQWEsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDNUQsQ0FBQztBQUVELE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxRQUFnQjtJQUMzRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxVQUFrQjtJQUNsRCxPQUFPLEdBQUcsVUFBVSxXQUFXLENBQUM7QUFDbEMsQ0FBQztBQUVELE1BQU0sVUFBVSw0QkFBNEIsQ0FBQyxVQUFrQjtJQUM3RCxPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQztBQUVuQyxNQUFNLFVBQVUsZUFBZSxDQUFDLElBQVk7SUFDMUMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsRUFBVTtJQUM1QyxPQUFPLFNBQVMsRUFBRSxFQUFFLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBTVFJJUF9TUkNfRklMRV9TVUZGSVhFUyA9IC8oXFwudHN8XFwuZFxcLnRzfFxcLmpzfFxcLmpzeHxcXC50c3gpJC87XG5jb25zdCBHRU5FUkFURURfRklMRSA9IC9cXC5uZ2ZhY3RvcnlcXC58XFwubmdzdW1tYXJ5XFwuLztcbmNvbnN0IEpJVF9TVU1NQVJZX0ZJTEUgPSAvXFwubmdzdW1tYXJ5XFwuLztcbmNvbnN0IEpJVF9TVU1NQVJZX05BTUUgPSAvTmdTdW1tYXJ5JC87XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ2ZhY3RvcnlGaWxlUGF0aChmaWxlUGF0aDogc3RyaW5nLCBmb3JjZVNvdXJjZUZpbGUgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGNvbnN0IHVybFdpdGhTdWZmaXggPSBzcGxpdFR5cGVzY3JpcHRTdWZmaXgoZmlsZVBhdGgsIGZvcmNlU291cmNlRmlsZSk7XG4gIHJldHVybiBgJHt1cmxXaXRoU3VmZml4WzBdfS5uZ2ZhY3Rvcnkke25vcm1hbGl6ZUdlbkZpbGVTdWZmaXgodXJsV2l0aFN1ZmZpeFsxXSl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwR2VuZXJhdGVkRmlsZVN1ZmZpeChmaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGZpbGVQYXRoLnJlcGxhY2UoR0VORVJBVEVEX0ZJTEUsICcuJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dlbmVyYXRlZEZpbGUoZmlsZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gR0VORVJBVEVEX0ZJTEUudGVzdChmaWxlUGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdFR5cGVzY3JpcHRTdWZmaXgocGF0aDogc3RyaW5nLCBmb3JjZVNvdXJjZUZpbGUgPSBmYWxzZSk6IHN0cmluZ1tdIHtcbiAgaWYgKHBhdGguZW5kc1dpdGgoJy5kLnRzJykpIHtcbiAgICByZXR1cm4gW3BhdGguc2xpY2UoMCwgLTUpLCBmb3JjZVNvdXJjZUZpbGUgPyAnLnRzJyA6ICcuZC50cyddO1xuICB9XG5cbiAgY29uc3QgbGFzdERvdCA9IHBhdGgubGFzdEluZGV4T2YoJy4nKTtcblxuICBpZiAobGFzdERvdCAhPT0gLTEpIHtcbiAgICByZXR1cm4gW3BhdGguc3Vic3RyaW5nKDAsIGxhc3REb3QpLCBwYXRoLnN1YnN0cmluZyhsYXN0RG90KV07XG4gIH1cblxuICByZXR1cm4gW3BhdGgsICcnXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUdlbkZpbGVTdWZmaXgoc3JjRmlsZVN1ZmZpeDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNyY0ZpbGVTdWZmaXggPT09ICcudHN4JyA/ICcudHMnIDogc3JjRmlsZVN1ZmZpeDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1bW1hcnlGaWxlTmFtZShmaWxlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgZmlsZU5hbWVXaXRob3V0U3VmZml4ID0gZmlsZU5hbWUucmVwbGFjZShTVFJJUF9TUkNfRklMRV9TVUZGSVhFUywgJycpO1xuICByZXR1cm4gYCR7ZmlsZU5hbWVXaXRob3V0U3VmZml4fS5uZ3N1bW1hcnkuanNvbmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdW1tYXJ5Rm9ySml0RmlsZU5hbWUoZmlsZU5hbWU6IHN0cmluZywgZm9yY2VTb3VyY2VGaWxlID0gZmFsc2UpOiBzdHJpbmcge1xuICBjb25zdCB1cmxXaXRoU3VmZml4ID0gc3BsaXRUeXBlc2NyaXB0U3VmZml4KHN0cmlwR2VuZXJhdGVkRmlsZVN1ZmZpeChmaWxlTmFtZSksIGZvcmNlU291cmNlRmlsZSk7XG4gIHJldHVybiBgJHt1cmxXaXRoU3VmZml4WzBdfS5uZ3N1bW1hcnkke3VybFdpdGhTdWZmaXhbMV19YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmlwU3VtbWFyeUZvckppdEZpbGVTdWZmaXgoZmlsZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBmaWxlUGF0aC5yZXBsYWNlKEpJVF9TVU1NQVJZX0ZJTEUsICcuJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdW1tYXJ5Rm9ySml0TmFtZShzeW1ib2xOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7c3ltYm9sTmFtZX1OZ1N1bW1hcnlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyaXBTdW1tYXJ5Rm9ySml0TmFtZVN1ZmZpeChzeW1ib2xOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gc3ltYm9sTmFtZS5yZXBsYWNlKEpJVF9TVU1NQVJZX05BTUUsICcnKTtcbn1cblxuY29uc3QgTE9XRVJFRF9TWU1CT0wgPSAvXFx1MDI3NVxcZCsvO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNMb3dlcmVkU3ltYm9sKG5hbWU6IHN0cmluZykge1xuICByZXR1cm4gTE9XRVJFRF9TWU1CT0wudGVzdChuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvd2VyZWRTeW1ib2woaWQ6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgXFx1MDI3NSR7aWR9YDtcbn1cbiJdfQ==