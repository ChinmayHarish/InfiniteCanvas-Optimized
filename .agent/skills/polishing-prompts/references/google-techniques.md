# Google Prompt Engineering Techniques Reference

Detailed reference from Google's Prompt Engineering whitepaper.

## Prompting Techniques

### Zero-Shot Prompting
Direct prompting without examples. The model relies on pretrained knowledge.

**When to use**: Simple tasks where the model understands the expected format.

**Example**:
```
Classify this review as POSITIVE, NEUTRAL, or NEGATIVE.
Review: "The product exceeded my expectations!"
```

---

### Few-Shot Prompting
Provide 2-5 examples to teach pattern and format.

**When to use**: 
- Need consistent formatting
- Specific reasoning patterns
- Handling edge cases

**Example**:
```
Extract order information as JSON.

Input: "I want a small pizza with cheese and pepperoni"
Output: {"size": "small", "ingredients": ["cheese", "pepperoni"]}

Input: "Large margherita please"
Output: {"size": "large", "ingredients": ["tomato", "mozzarella", "basil"]}

Input: "Medium with mushrooms and olives"
```

**Best practices**:
- Use diverse, representative examples
- Include edge cases
- Quality matters more than quantity

---

### System Prompting
Define overall context and purpose for the model.

**When to use**: Set global behavior, output format, or safety rules.

**Example**:
```
Classify movie reviews as positive, neutral, or negative.
Only return the label in uppercase.
Return as JSON: {"sentiment": "LABEL", "confidence": 0.0-1.0}
```

**Benefits**:
- Forces structured output
- Reduces hallucinations
- Enables safety controls

---

### Role Prompting
Assign a specific character or identity.

**When to use**: Need specific tone, expertise, or perspective.

**Effective styles**: 
Confrontational, Descriptive, Direct, Formal, Humorous, Influential, 
Informal, Inspirational, Persuasive

**Example**:
```
You are a senior software architect with 15 years of experience.
Review this code for security vulnerabilities and scalability issues.
Be direct and specific in your feedback.
```

---

### Contextual Prompting
Provide specific background information for the current task.

**When to use**: Task requires domain knowledge or specific context.

**Example**:
```
Context: Our company uses PostgreSQL 15 with pgvector extension.
Our main tables are: users, orders, products.
All timestamps are in UTC.

Task: Write a query to find users who haven't ordered in 30 days.
```

---

### Chain-of-Thought (CoT)
Request step-by-step reasoning before the final answer.

**When to use**:
- Complex multi-step problems
- Mathematical reasoning
- Logic puzzles
- When you need to verify thinking

**Zero-shot CoT**:
```
Solve this problem. Let's think step by step.

Problem: If a train travels 120 miles in 2 hours, then slows down 
and travels 90 miles in 3 hours, what is the average speed?
```

**Few-shot CoT**: Include examples with reasoning traces.

**Critical rules**:
- Put answer AFTER reasoning
- Set temperature to 0
- Use when single correct answer exists

---

### Self-Consistency
Generate multiple reasoning paths, take the majority answer.

**When to use**: High-stakes decisions where accuracy is critical.

**Process**:
1. Generate 3-5 different reasoning chains
2. Extract final answer from each
3. Take most common answer

**Configuration**: Use temperature > 0 to get diverse responses

---

### Tree of Thoughts (ToT)
Explore multiple reasoning paths simultaneously.

**When to use**: Complex tasks requiring exploration of alternatives.

**Concept**: Maintain a tree where each node is a reasoning step.
Branch when multiple approaches are viable.

---

### ReAct (Reason + Act)
Combine reasoning with external actions/tools.

**When to use**: Need to interact with APIs, databases, or search.

**Pattern**:
```
Thought: [Reason about what to do]
Action: [Tool to use]
Action Input: [Input for tool]
Observation: [Result from tool]
... repeat until solved ...
Final Answer: [Result]
```

---

## Configuration Guide

### Temperature
| Setting | Use Case |
|---------|----------|
| 0 | Factual answers, math, classification |
| 0.1-0.3 | Coherent, slightly varied output |
| 0.4-0.6 | Balanced creativity |
| 0.7-0.9 | Creative writing, brainstorming |
| 1.0+ | Maximum creativity (may be incoherent) |

### Starting Points
- **Coherent results**: temp=0.2, top-P=0.95, top-K=30
- **Creative results**: temp=0.9, top-P=0.99, top-K=40
- **Conservative results**: temp=0.1, top-P=0.9, top-K=20
- **Single correct answer**: temp=0

---

## Best Practices

1. **Document attempts** - Track what works and what doesn't
2. **Iterate** - Small changes can have large impacts
3. **Test edge cases** - Include unusual inputs
4. **Version control** - Treat prompts as code
5. **Use structured output** - JSON reduces hallucinations
6. **Separate prompts from code** - Easier maintenance
