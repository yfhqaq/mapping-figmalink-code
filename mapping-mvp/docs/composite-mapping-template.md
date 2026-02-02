# Composite Mapping Template (Generic)

Use this template when multiple UX components in Figma should map to a single
front-end component with props/slots.

## 1) Scenario Definition
- Feature / page:
- Figma node(s):
- Target front-end component:
- Why composite (not 1:1):

## 2) UX Components Involved (Figma Fingerprints)
List component sets / instances and the role they play in the final component.

- ComponentSet/Instance A:
  - Figma name:
  - componentId / componentSetId:
  - Role in final component:
- ComponentSet/Instance B:
  - Figma name:
  - componentId / componentSetId:
  - Role in final component:

## 3) Composite Rule (Human Readable)
When a node contains:
- [Fingerprint A]
- [Fingerprint B]
Then:
Use `<TargetComponent>` and map:
- Slot/prop X <- [A]
- Slot/prop Y <- [B]

## 4) Prop/Slot Mapping Schema
Define the mapping rules from UX parts to code props.

```
{
  "component": "<TargetComponent>",
  "props": {
    "propA": {
      "source": "componentSet:<ID or name>",
      "strategy": "extract-text | variant-map | child-list | instance-swap",
      "notes": ""
    },
    "propB": {
      "source": "componentSet:<ID or name>",
      "strategy": "group-to-array | group-to-object",
      "notes": ""
    }
  }
}
```

## 5) Variant Mapping (Optional)
If the UX parts have variants that map to props, list them.

- Variant name:
  - UX values -> Code values

## 6) Confidence + Fallback
- Confidence:
- Fallback rule if a fingerprint is missing:

## 7) LLM Context Snippet
Use this condensed form in `llm-context.md`.

```
CompositeRule:
  if contains [A, B, C] then use <TargetComponent>
  map: A->propX, B->propY, C->propZ
```
