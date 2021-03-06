/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/typecheck/api/symbols" />
import { TmplAstElement, TmplAstReference, TmplAstTemplate, TmplAstVariable } from '@angular/compiler';
import * as ts from 'typescript';
import { AbsoluteFsPath } from '../../file_system';
import { DirectiveInScope } from './scope';
export declare enum SymbolKind {
    Input = 0,
    Output = 1,
    Binding = 2,
    Reference = 3,
    Variable = 4,
    Directive = 5,
    Element = 6,
    Template = 7,
    Expression = 8,
    DomBinding = 9,
    Pipe = 10
}
/**
 * A representation of an entity in the `TemplateAst`.
 */
export declare type Symbol = InputBindingSymbol | OutputBindingSymbol | ElementSymbol | ReferenceSymbol | VariableSymbol | ExpressionSymbol | DirectiveSymbol | TemplateSymbol | DomBindingSymbol | PipeSymbol;
/**
 * A `Symbol` which declares a new named entity in the template scope.
 */
export declare type TemplateDeclarationSymbol = ReferenceSymbol | VariableSymbol;
/** Information about where a `ts.Node` can be found in the type check block shim file. */
export interface ShimLocation {
    /**
     * The fully qualified path of the file which contains the generated TypeScript type check
     * code for the component's template.
     */
    shimPath: AbsoluteFsPath;
    /** The location in the shim file where node appears. */
    positionInShimFile: number;
}
/**
 * A generic representation of some node in a template.
 */
export interface TsNodeSymbolInfo {
    /** The `ts.Type` of the template node. */
    tsType: ts.Type;
    /** The `ts.Symbol` for the template node */
    tsSymbol: ts.Symbol | null;
    /** The position of the most relevant part of the template node. */
    shimLocation: ShimLocation;
}
/**
 * A representation of an expression in a component template.
 */
export interface ExpressionSymbol {
    kind: SymbolKind.Expression;
    /** The `ts.Type` of the expression AST. */
    tsType: ts.Type;
    /**
     * The `ts.Symbol` of the entity. This could be `null`, for example `AST` expression
     * `{{foo.bar + foo.baz}}` does not have a `ts.Symbol` but `foo.bar` and `foo.baz` both do.
     */
    tsSymbol: ts.Symbol | null;
    /** The position of the most relevant part of the expression. */
    shimLocation: ShimLocation;
}
/** Represents either an input or output binding in a template. */
export interface BindingSymbol {
    kind: SymbolKind.Binding;
    /** The `ts.Type` of the class member on the directive that is the target of the binding. */
    tsType: ts.Type;
    /** The `ts.Symbol` of the class member on the directive that is the target of the binding. */
    tsSymbol: ts.Symbol;
    /**
     * The `DirectiveSymbol` or `ElementSymbol` for the Directive, Component, or `HTMLElement` with
     * the binding.
     */
    target: DirectiveSymbol | ElementSymbol | TemplateSymbol;
    /** The location in the shim file where the field access for the binding appears. */
    shimLocation: ShimLocation;
}
/**
 * A representation of an input binding in a component template.
 */
export interface InputBindingSymbol {
    kind: SymbolKind.Input;
    /** A single input may be bound to multiple components or directives. */
    bindings: BindingSymbol[];
}
/**
 * A representation of an output binding in a component template.
 */
export interface OutputBindingSymbol {
    kind: SymbolKind.Output;
    /** A single output may be bound to multiple components or directives. */
    bindings: BindingSymbol[];
}
/**
 * A representation of a local reference in a component template.
 */
export interface ReferenceSymbol {
    kind: SymbolKind.Reference;
    /**
     * The `ts.Type` of the Reference value.
     *
     * `TmplAstTemplate` - The type of the `TemplateRef`
     * `TmplAstElement` - The `ts.Type` for the `HTMLElement`.
     * Directive - The `ts.Type` for the class declaration.
     */
    tsType: ts.Type;
    /**
     * The `ts.Symbol` for the Reference value.
     *
     * `TmplAstTemplate` - A `TemplateRef` symbol.
     * `TmplAstElement` - The symbol for the `HTMLElement`.
     * Directive - The symbol for the class declaration of the directive.
     */
    tsSymbol: ts.Symbol;
    /**
     * Depending on the type of the reference, this is one of the following:
     *  - `TmplAstElement` when the local ref refers to the HTML element
     *  - `TmplAstTemplate` when the ref refers to an `ng-template`
     *  - `ts.ClassDeclaration` when the local ref refers to a Directive instance (#ref="myExportAs")
     */
    target: TmplAstElement | TmplAstTemplate | ts.ClassDeclaration;
    /**
     * The node in the `TemplateAst` where the symbol is declared. That is, node for the `#ref` or
     * `#ref="exportAs"`.
     */
    declaration: TmplAstReference;
    /**
     * The location in the shim file of a variable that holds the type of the local ref.
     * For example, a reference declaration like the following:
     * ```
     * var _t1 = document.createElement('div');
     * var _t2 = _t1; // This is the reference declaration
     * ```
     * This `targetLocation` is `[_t1 variable declaration].getStart()`.
     */
    targetLocation: ShimLocation;
    /**
     * The location in the TCB for the identifier node in the reference variable declaration.
     * For example, given a variable declaration statement for a template reference:
     * `var _t2 = _t1`, this location is `[_t2 node].getStart()`. This location can
     * be used to find references to the variable within the template.
     */
    referenceVarLocation: ShimLocation;
}
/**
 * A representation of a context variable in a component template.
 */
export interface VariableSymbol {
    kind: SymbolKind.Variable;
    /**
     * The `ts.Type` of the entity.
     *
     * This will be `any` if there is no `ngTemplateContextGuard`.
     */
    tsType: ts.Type;
    /**
     * The `ts.Symbol` for the context variable.
     *
     * This will be `null` if there is no `ngTemplateContextGuard`.
     */
    tsSymbol: ts.Symbol | null;
    /**
     * The node in the `TemplateAst` where the variable is declared. That is, the node for the `let-`
     * node in the template.
     */
    declaration: TmplAstVariable;
    /**
     * The location in the shim file for the identifier that was declared for the template variable.
     */
    localVarLocation: ShimLocation;
    /**
     * The location in the shim file for the initializer node of the variable that represents the
     * template variable.
     */
    initializerLocation: ShimLocation;
}
/**
 * A representation of an element in a component template.
 */
export interface ElementSymbol {
    kind: SymbolKind.Element;
    /** The `ts.Type` for the `HTMLElement`. */
    tsType: ts.Type;
    /** The `ts.Symbol` for the `HTMLElement`. */
    tsSymbol: ts.Symbol | null;
    /** A list of directives applied to the element. */
    directives: DirectiveSymbol[];
    /** The location in the shim file for the variable that holds the type of the element. */
    shimLocation: ShimLocation;
    templateNode: TmplAstElement;
}
export interface TemplateSymbol {
    kind: SymbolKind.Template;
    /** A list of directives applied to the element. */
    directives: DirectiveSymbol[];
    templateNode: TmplAstTemplate;
}
/**
 * A representation of a directive/component whose selector matches a node in a component
 * template.
 */
export interface DirectiveSymbol extends DirectiveInScope {
    kind: SymbolKind.Directive;
    /** The `ts.Type` for the class declaration. */
    tsType: ts.Type;
    /** The location in the shim file for the variable that holds the type of the directive. */
    shimLocation: ShimLocation;
}
/**
 * A representation of an attribute on an element or template. These bindings aren't currently
 * type-checked (see `checkTypeOfDomBindings`) so they won't have a `ts.Type`, `ts.Symbol`, or shim
 * location.
 */
export interface DomBindingSymbol {
    kind: SymbolKind.DomBinding;
    /** The symbol for the element or template of the text attribute. */
    host: ElementSymbol | TemplateSymbol;
}
/**
 * A representation for a call to a pipe's transform method in the TCB.
 */
export interface PipeSymbol {
    kind: SymbolKind.Pipe;
    /** The `ts.Type` of the transform node. */
    tsType: ts.Type;
    /**
     * The `ts.Symbol` for the transform call. This could be `null` when `checkTypeOfPipes` is set to
     * `false` because the transform call would be of the form `(_pipe1 as any).transform()`
     */
    tsSymbol: ts.Symbol | null;
    /** The position of the transform call in the template. */
    shimLocation: ShimLocation;
    /** The symbol for the pipe class as an instance that appears in the TCB. */
    classSymbol: ClassSymbol;
}
/** Represents an instance of a class found in the TCB, i.e. `var _pipe1: MyPipe = null!; */
export interface ClassSymbol {
    /** The `ts.Type` of class. */
    tsType: ts.Type;
    /** The `ts.Symbol` for class. */
    tsSymbol: ts.Symbol;
    /** The position for the variable declaration for the class instance. */
    shimLocation: ShimLocation;
}
