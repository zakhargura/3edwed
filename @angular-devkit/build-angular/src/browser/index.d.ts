/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { WebpackLoggingCallback } from '@angular-devkit/build-webpack';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import * as webpack from 'webpack';
import { ExecutionTransformer } from '../transforms';
import { WebpackConfigOptions } from '../utils/build-options';
import { IndexHtmlTransform } from '../utils/index-file/index-html-generator';
import { Schema as BrowserBuilderSchema } from './schema';
export declare type BrowserBuilderOutput = json.JsonObject & BuilderOutput & {
    baseOutputPath: string;
    outputPaths: string[];
    /**
     * @deprecated in version 9. Use 'outputPaths' instead.
     */
    outputPath: string;
};
export declare function getAnalyticsConfig(wco: WebpackConfigOptions, context: BuilderContext): webpack.Configuration;
export declare function getCompilerConfig(wco: WebpackConfigOptions): webpack.Configuration;
export declare function buildWebpackBrowser(options: BrowserBuilderSchema, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
    logging?: WebpackLoggingCallback;
    indexHtml?: IndexHtmlTransform;
}): Observable<BrowserBuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<json.JsonObject & BrowserBuilderSchema>;
export default _default;
