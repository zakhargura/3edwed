import * as o from '../../../output/output_ast';
import { ParseSourceSpan } from '../../../parse_util';
import { serializeIcuNode } from './icu_serializer';
import { formatI18nPlaceholderName } from './util';
export function createLocalizeStatements(variable, message, params) {
    const { messageParts, placeHolders } = serializeI18nMessageForLocalize(message);
    const sourceSpan = getSourceSpan(message);
    const expressions = placeHolders.map(ph => params[ph.text]);
    const localizedString = o.localizedString(message, messageParts, placeHolders, expressions, sourceSpan);
    const variableInitialization = variable.set(localizedString);
    return [new o.ExpressionStatement(variableInitialization)];
}
/**
 * This visitor walks over an i18n tree, capturing literal strings and placeholders.
 *
 * The result can be used for generating the `$localize` tagged template literals.
 */
class LocalizeSerializerVisitor {
    visitText(text, context) {
        if (context[context.length - 1] instanceof o.LiteralPiece) {
            // Two literal pieces in a row means that there was some comment node in-between.
            context[context.length - 1].text += text.value;
        }
        else {
            context.push(new o.LiteralPiece(text.value, text.sourceSpan));
        }
    }
    visitContainer(container, context) {
        container.children.forEach(child => child.visit(this, context));
    }
    visitIcu(icu, context) {
        context.push(new o.LiteralPiece(serializeIcuNode(icu), icu.sourceSpan));
    }
    visitTagPlaceholder(ph, context) {
        var _a, _b;
        context.push(this.createPlaceholderPiece(ph.startName, (_a = ph.startSourceSpan) !== null && _a !== void 0 ? _a : ph.sourceSpan));
        if (!ph.isVoid) {
            ph.children.forEach(child => child.visit(this, context));
            context.push(this.createPlaceholderPiece(ph.closeName, (_b = ph.endSourceSpan) !== null && _b !== void 0 ? _b : ph.sourceSpan));
        }
    }
    visitPlaceholder(ph, context) {
        context.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan));
    }
    visitIcuPlaceholder(ph, context) {
        context.push(this.createPlaceholderPiece(ph.name, ph.sourceSpan));
    }
    createPlaceholderPiece(name, sourceSpan) {
        return new o.PlaceholderPiece(formatI18nPlaceholderName(name, /* useCamelCase */ false), sourceSpan);
    }
}
const serializerVisitor = new LocalizeSerializerVisitor();
/**
 * Serialize an i18n message into two arrays: messageParts and placeholders.
 *
 * These arrays will be used to generate `$localize` tagged template literals.
 *
 * @param message The message to be serialized.
 * @returns an object containing the messageParts and placeholders.
 */
export function serializeI18nMessageForLocalize(message) {
    const pieces = [];
    message.nodes.forEach(node => node.visit(serializerVisitor, pieces));
    return processMessagePieces(pieces);
}
function getSourceSpan(message) {
    const startNode = message.nodes[0];
    const endNode = message.nodes[message.nodes.length - 1];
    return new ParseSourceSpan(startNode.sourceSpan.start, endNode.sourceSpan.end, startNode.sourceSpan.fullStart, startNode.sourceSpan.details);
}
/**
 * Convert the list of serialized MessagePieces into two arrays.
 *
 * One contains the literal string pieces and the other the placeholders that will be replaced by
 * expressions when rendering `$localize` tagged template literals.
 *
 * @param pieces The pieces to process.
 * @returns an object containing the messageParts and placeholders.
 */
function processMessagePieces(pieces) {
    const messageParts = [];
    const placeHolders = [];
    if (pieces[0] instanceof o.PlaceholderPiece) {
        // The first piece was a placeholder so we need to add an initial empty message part.
        messageParts.push(createEmptyMessagePart(pieces[0].sourceSpan.start));
    }
    for (let i = 0; i < pieces.length; i++) {
        const part = pieces[i];
        if (part instanceof o.LiteralPiece) {
            messageParts.push(part);
        }
        else {
            placeHolders.push(part);
            if (pieces[i - 1] instanceof o.PlaceholderPiece) {
                // There were two placeholders in a row, so we need to add an empty message part.
                messageParts.push(createEmptyMessagePart(pieces[i - 1].sourceSpan.end));
            }
        }
    }
    if (pieces[pieces.length - 1] instanceof o.PlaceholderPiece) {
        // The last piece was a placeholder so we need to add a final empty message part.
        messageParts.push(createEmptyMessagePart(pieces[pieces.length - 1].sourceSpan.end));
    }
    return { messageParts, placeHolders };
}
function createEmptyMessagePart(location) {
    return new o.LiteralPiece('', new ParseSourceSpan(location, location));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxpemVfdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvcmVuZGVyMy92aWV3L2kxOG4vbG9jYWxpemVfdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxLQUFLLENBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUNoRCxPQUFPLEVBQWdCLGVBQWUsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRW5FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUVqRCxNQUFNLFVBQVUsd0JBQXdCLENBQ3BDLFFBQXVCLEVBQUUsT0FBcUIsRUFDOUMsTUFBc0M7SUFDeEMsTUFBTSxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsR0FBRywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5RSxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxNQUFNLGVBQWUsR0FDakIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEYsTUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzdELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7QUFDN0QsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLHlCQUF5QjtJQUM3QixTQUFTLENBQUMsSUFB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Qy9DLGlGQUFpRjtnQkFDakYsWUFBWSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ3pFO1NBQ0Y7S0FDRjtJQUNELElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLGdCQUFnQixFQUFFO1FBQzNELGlGQUFpRjtRQUNqRixZQUFZLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ3JGO0lBQ0QsT0FBTyxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsU0FBUyxzQkFBc0IsQ0FBQyxRQUF1QjtJQUNyRCxPQUFPLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDekUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgaTE4biBmcm9tICcuLi8uLi8uLi9pMThuL2kxOG5fYXN0JztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vLi4vLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtQYXJzZUxvY2F0aW9uLCBQYXJzZVNvdXJjZVNwYW59IGZyb20gJy4uLy4uLy4uL3BhcnNlX3V0aWwnO1xuXG5pbXBvcnQge3NlcmlhbGl6ZUljdU5vZGV9IGZyb20gJy4vaWN1X3NlcmlhbGl6ZXInO1xuaW1wb3J0IHtmb3JtYXRJMThuUGxhY2Vob2xkZXJOYW1lfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9jYWxpemVTdGF0ZW1lbnRzKFxuICAgIHZhcmlhYmxlOiBvLlJlYWRWYXJFeHByLCBtZXNzYWdlOiBpMThuLk1lc3NhZ2UsXG4gICAgcGFyYW1zOiB7W25hbWU6IHN0cmluZ106IG8uRXhwcmVzc2lvbn0pOiBvLlN0YXRlbWVudFtdIHtcbiAgY29uc3Qge21lc3NhZ2VQYXJ0cywgcGxhY2VIb2xkZXJzfSA9IHNlcmlhbGl6ZUkxOG5NZXNzYWdlRm9yTG9jYWxpemUobWVzc2FnZSk7XG4gIGNvbnN0IHNvdXJjZVNwYW4gPSBnZXRTb3VyY2VTcGFuKG1lc3NhZ2UpO1xuICBjb25zdCBleHByZXNzaW9ucyA9IHBsYWNlSG9sZGVycy5tYXAocGggPT4gcGFyYW1zW3BoLnRleHRdKTtcbiAgY29uc3QgbG9jYWxpemVkU3RyaW5nID1cbiAgICAgIG8ubG9jYWxpemVkU3RyaW5nKG1lc3NhZ2UsIG1lc3NhZ2VQYXJ0cywgcGxhY2VIb2xkZXJzLCBleHByZXNzaW9ucywgc291cmNlU3Bhbik7XG4gIGNvbnN0IHZhcmlhYmxlSW5pdGlhbGl6YXRpb24gPSB2YXJpYWJsZS5zZXQobG9jYWxpemVkU3RyaW5nKTtcbiAgcmV0dXJuIFtuZXcgby5FeHByZXNzaW9uU3RhdGVtZW50KHZhcmlhYmxlSW5pdGlhbGl6YXRpb24pXTtcbn1cblxuLyoqXG4gKiBUaGlzIHZpc2l0b3Igd2Fsa3Mgb3ZlciBhbiBpMThuIHRyZWUsIGNhcHR1cmluZyBsaXRlcmFsIHN0cmluZ3MgYW5kIHBsYWNlaG9sZGVycy5cbiAqXG4gKiBUaGUgcmVzdWx0IGNhbiBiZSB1c2VkIGZvciBnZW5lcmF0aW5nIHRoZSBgJGxvY2FsaXplYCB0YWdnZWQgdGVtcGxhdGUgbGl0ZXJhbHMuXG4gKi9cbmNsYXNzIExvY2FsaXplU2VyaWFsaXplclZpc2l0b3IgaW1wbGVtZW50cyBpMThuLlZpc2l0b3Ige1xuICB2aXNpdFRleHQodGV4dDogaTE4bi5UZXh0LCBjb250ZXh0OiBvLk1lc3NhZ2VQaWVjZVtdKTogYW55IHtcbiAgICBpZiAoY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdIGluc3RhbmNlb2Ygby5MaXRlcmFsUGllY2UpIHtcbiAgICAgIC8vIFR3byBsaXRlcmFsIHBpZWNlcyBpbiBhIHJvdyBtZWFucyB0aGF0IHRoZXJlIHdhcyBzb21lIGNvbW1lbnQgbm9kZSBpbi1iZXR3ZWVuLlxuICAgICAgY29udGV4dFtjb250ZXh0Lmxlbmd0aCAtIDFdLnRleHQgKz0gdGV4dC52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dC5wdXNoKG5ldyBvLkxpdGVyYWxQaWVjZSh0ZXh0LnZhbHVlLCB0ZXh0LnNvdXJjZVNwYW4pKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdENvbnRhaW5lcihjb250YWluZXI6IGkxOG4uQ29udGFpbmVyLCBjb250ZXh0OiBvLk1lc3NhZ2VQaWVjZVtdKTogYW55IHtcbiAgICBjb250YWluZXIuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzLCBjb250ZXh0KSk7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IGkxOG4uSWN1LCBjb250ZXh0OiBvLk1lc3NhZ2VQaWVjZVtdKTogYW55IHtcbiAgICBjb250ZXh0LnB1c2gobmV3IG8uTGl0ZXJhbFBpZWNlKHNlcmlhbGl6ZUljdU5vZGUoaWN1KSwgaWN1LnNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHZpc2l0VGFnUGxhY2Vob2xkZXIocGg6IGkxOG4uVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ6IG8uTWVzc2FnZVBpZWNlW10pOiBhbnkge1xuICAgIGNvbnRleHQucHVzaCh0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyUGllY2UocGguc3RhcnROYW1lLCBwaC5zdGFydFNvdXJjZVNwYW4gPz8gcGguc291cmNlU3BhbikpO1xuICAgIGlmICghcGguaXNWb2lkKSB7XG4gICAgICBwaC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMsIGNvbnRleHQpKTtcbiAgICAgIGNvbnRleHQucHVzaCh0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyUGllY2UocGguY2xvc2VOYW1lLCBwaC5lbmRTb3VyY2VTcGFuID8/IHBoLnNvdXJjZVNwYW4pKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBpMThuLlBsYWNlaG9sZGVyLCBjb250ZXh0OiBvLk1lc3NhZ2VQaWVjZVtdKTogYW55IHtcbiAgICBjb250ZXh0LnB1c2godGhpcy5jcmVhdGVQbGFjZWhvbGRlclBpZWNlKHBoLm5hbWUsIHBoLnNvdXJjZVNwYW4pKTtcbiAgfVxuXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IGkxOG4uSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnRleHQucHVzaCh0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyUGllY2UocGgubmFtZSwgcGguc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVQbGFjZWhvbGRlclBpZWNlKG5hbWU6IHN0cmluZywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKTogby5QbGFjZWhvbGRlclBpZWNlIHtcbiAgICByZXR1cm4gbmV3IG8uUGxhY2Vob2xkZXJQaWVjZShcbiAgICAgICAgZm9ybWF0STE4blBsYWNlaG9sZGVyTmFtZShuYW1lLCAvKiB1c2VDYW1lbENhc2UgKi8gZmFsc2UpLCBzb3VyY2VTcGFuKTtcbiAgfVxufVxuXG5jb25zdCBzZXJpYWxpemVyVmlzaXRvciA9IG5ldyBMb2NhbGl6ZVNlcmlhbGl6ZXJWaXNpdG9yKCk7XG5cbi8qKlxuICogU2VyaWFsaXplIGFuIGkxOG4gbWVzc2FnZSBpbnRvIHR3byBhcnJheXM6IG1lc3NhZ2VQYXJ0cyBhbmQgcGxhY2Vob2xkZXJzLlxuICpcbiAqIFRoZXNlIGFycmF5cyB3aWxsIGJlIHVzZWQgdG8gZ2VuZXJhdGUgYCRsb2NhbGl6ZWAgdGFnZ2VkIHRlbXBsYXRlIGxpdGVyYWxzLlxuICpcbiAqIEBwYXJhbSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGJlIHNlcmlhbGl6ZWQuXG4gKiBAcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWVzc2FnZVBhcnRzIGFuZCBwbGFjZWhvbGRlcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemVJMThuTWVzc2FnZUZvckxvY2FsaXplKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6XG4gICAge21lc3NhZ2VQYXJ0czogby5MaXRlcmFsUGllY2VbXSwgcGxhY2VIb2xkZXJzOiBvLlBsYWNlaG9sZGVyUGllY2VbXX0ge1xuICBjb25zdCBwaWVjZXM6IG8uTWVzc2FnZVBpZWNlW10gPSBbXTtcbiAgbWVzc2FnZS5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS52aXNpdChzZXJpYWxpemVyVmlzaXRvciwgcGllY2VzKSk7XG4gIHJldHVybiBwcm9jZXNzTWVzc2FnZVBpZWNlcyhwaWVjZXMpO1xufVxuXG5mdW5jdGlvbiBnZXRTb3VyY2VTcGFuKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IFBhcnNlU291cmNlU3BhbiB7XG4gIGNvbnN0IHN0YXJ0Tm9kZSA9IG1lc3NhZ2Uubm9kZXNbMF07XG4gIGNvbnN0IGVuZE5vZGUgPSBtZXNzYWdlLm5vZGVzW21lc3NhZ2Uubm9kZXMubGVuZ3RoIC0gMV07XG4gIHJldHVybiBuZXcgUGFyc2VTb3VyY2VTcGFuKFxuICAgICAgc3RhcnROb2RlLnNvdXJjZVNwYW4uc3RhcnQsIGVuZE5vZGUuc291cmNlU3Bhbi5lbmQsIHN0YXJ0Tm9kZS5zb3VyY2VTcGFuLmZ1bGxTdGFydCxcbiAgICAgIHN0YXJ0Tm9kZS5zb3VyY2VTcGFuLmRldGFpbHMpO1xufVxuXG4vKipcbiAqIENvbnZlcnQgdGhlIGxpc3Qgb2Ygc2VyaWFsaXplZCBNZXNzYWdlUGllY2VzIGludG8gdHdvIGFycmF5cy5cbiAqXG4gKiBPbmUgY29udGFpbnMgdGhlIGxpdGVyYWwgc3RyaW5nIHBpZWNlcyBhbmQgdGhlIG90aGVyIHRoZSBwbGFjZWhvbGRlcnMgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5XG4gKiBleHByZXNzaW9ucyB3aGVuIHJlbmRlcmluZyBgJGxvY2FsaXplYCB0YWdnZWQgdGVtcGxhdGUgbGl0ZXJhbHMuXG4gKlxuICogQHBhcmFtIHBpZWNlcyBUaGUgcGllY2VzIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgbWVzc2FnZVBhcnRzIGFuZCBwbGFjZWhvbGRlcnMuXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NNZXNzYWdlUGllY2VzKHBpZWNlczogby5NZXNzYWdlUGllY2VbXSk6XG4gICAge21lc3NhZ2VQYXJ0czogby5MaXRlcmFsUGllY2VbXSwgcGxhY2VIb2xkZXJzOiBvLlBsYWNlaG9sZGVyUGllY2VbXX0ge1xuICBjb25zdCBtZXNzYWdlUGFydHM6IG8uTGl0ZXJhbFBpZWNlW10gPSBbXTtcbiAgY29uc3QgcGxhY2VIb2xkZXJzOiBvLlBsYWNlaG9sZGVyUGllY2VbXSA9IFtdO1xuXG4gIGlmIChwaWVjZXNbMF0gaW5zdGFuY2VvZiBvLlBsYWNlaG9sZGVyUGllY2UpIHtcbiAgICAvLyBUaGUgZmlyc3QgcGllY2Ugd2FzIGEgcGxhY2Vob2xkZXIgc28gd2UgbmVlZCB0byBhZGQgYW4gaW5pdGlhbCBlbXB0eSBtZXNzYWdlIHBhcnQuXG4gICAgbWVzc2FnZVBhcnRzLnB1c2goY3JlYXRlRW1wdHlNZXNzYWdlUGFydChwaWVjZXNbMF0uc291cmNlU3Bhbi5zdGFydCkpO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwaWVjZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwYXJ0ID0gcGllY2VzW2ldO1xuICAgIGlmIChwYXJ0IGluc3RhbmNlb2Ygby5MaXRlcmFsUGllY2UpIHtcbiAgICAgIG1lc3NhZ2VQYXJ0cy5wdXNoKHBhcnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGFjZUhvbGRlcnMucHVzaChwYXJ0KTtcbiAgICAgIGlmIChwaWVjZXNbaSAtIDFdIGluc3RhbmNlb2Ygby5QbGFjZWhvbGRlclBpZWNlKSB7XG4gICAgICAgIC8vIFRoZXJlIHdlcmUgdHdvIHBsYWNlaG9sZGVycyBpbiBhIHJvdywgc28gd2UgbmVlZCB0byBhZGQgYW4gZW1wdHkgbWVzc2FnZSBwYXJ0LlxuICAgICAgICBtZXNzYWdlUGFydHMucHVzaChjcmVhdGVFbXB0eU1lc3NhZ2VQYXJ0KHBpZWNlc1tpIC0gMV0uc291cmNlU3Bhbi5lbmQpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHBpZWNlc1twaWVjZXMubGVuZ3RoIC0gMV0gaW5zdGFuY2VvZiBvLlBsYWNlaG9sZGVyUGllY2UpIHtcbiAgICAvLyBUaGUgbGFzdCBwaWVjZSB3YXMgYSBwbGFjZWhvbGRlciBzbyB3ZSBuZWVkIHRvIGFkZCBhIGZpbmFsIGVtcHR5IG1lc3NhZ2UgcGFydC5cbiAgICBtZXNzYWdlUGFydHMucHVzaChjcmVhdGVFbXB0eU1lc3NhZ2VQYXJ0KHBpZWNlc1twaWVjZXMubGVuZ3RoIC0gMV0uc291cmNlU3Bhbi5lbmQpKTtcbiAgfVxuICByZXR1cm4ge21lc3NhZ2VQYXJ0cywgcGxhY2VIb2xkZXJzfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRW1wdHlNZXNzYWdlUGFydChsb2NhdGlvbjogUGFyc2VMb2NhdGlvbik6IG8uTGl0ZXJhbFBpZWNlIHtcbiAgcmV0dXJuIG5ldyBvLkxpdGVyYWxQaWVjZSgnJywgbmV3IFBhcnNlU291cmNlU3Bhbihsb2NhdGlvbiwgbG9jYXRpb24pKTtcbn1cbiJdfQ==