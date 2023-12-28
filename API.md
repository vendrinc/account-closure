# replace this
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### AccountClosureStepFunction <a name="AccountClosureStepFunction" id="@vendrinc/account-closure.AccountClosureStepFunction"></a>

#### Initializers <a name="Initializers" id="@vendrinc/account-closure.AccountClosureStepFunction.Initializer"></a>

```typescript
import { AccountClosureStepFunction } from '@vendrinc/account-closure'

new AccountClosureStepFunction(scope: Construct, id: string, props: AccountClosureStepFunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.props">props</a></code> | <code><a href="#@vendrinc/account-closure.AccountClosureStepFunctionProps">AccountClosureStepFunctionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@vendrinc/account-closure.AccountClosureStepFunction.Initializer.parameter.props"></a>

- *Type:* <a href="#@vendrinc/account-closure.AccountClosureStepFunctionProps">AccountClosureStepFunctionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@vendrinc/account-closure.AccountClosureStepFunction.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@vendrinc/account-closure.AccountClosureStepFunction.isConstruct"></a>

```typescript
import { AccountClosureStepFunction } from '@vendrinc/account-closure'

AccountClosureStepFunction.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@vendrinc/account-closure.AccountClosureStepFunction.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunction.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@vendrinc/account-closure.AccountClosureStepFunction.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### AccountClosureStepFunctionProps <a name="AccountClosureStepFunctionProps" id="@vendrinc/account-closure.AccountClosureStepFunctionProps"></a>

#### Initializer <a name="Initializer" id="@vendrinc/account-closure.AccountClosureStepFunctionProps.Initializer"></a>

```typescript
import { AccountClosureStepFunctionProps } from '@vendrinc/account-closure'

const accountClosureStepFunctionProps: AccountClosureStepFunctionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunctionProps.property.privilegedRoleArn">privilegedRoleArn</a></code> | <code>string</code> | Arn of privledged role to be assumed by the stepfunction when closing accounts. |
| <code><a href="#@vendrinc/account-closure.AccountClosureStepFunctionProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | Custom schedule for the event rule @default 1 day. |

---

##### `privilegedRoleArn`<sup>Required</sup> <a name="privilegedRoleArn" id="@vendrinc/account-closure.AccountClosureStepFunctionProps.property.privilegedRoleArn"></a>

```typescript
public readonly privilegedRoleArn: string;
```

- *Type:* string

Arn of privledged role to be assumed by the stepfunction when closing accounts.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="@vendrinc/account-closure.AccountClosureStepFunctionProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

Custom schedule for the event rule @default 1 day.

---



