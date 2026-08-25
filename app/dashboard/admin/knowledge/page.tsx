"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeAdmin } from "@/features/knowledge-base/hooks";
import type { KnowledgeArticle, KnowledgeArticleDraft } from "@/features/knowledge-base/types";
import { PageHeader } from "@/features/dashboard/components";

const emptyDraft: KnowledgeArticleDraft = { category: "", question: "", answer: "" };

function ArticleForm({
  initial,
  saving,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: KnowledgeArticleDraft;
  saving: boolean;
  submitLabel: string;
  onSubmit: (draft: KnowledgeArticleDraft) => void;
  onCancel?: () => void;
}) {
  const [draft, setDraft] = useState(initial);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(draft);
      }}
      className="flex flex-col gap-3"
    >
      <FormField label="Category" htmlFor="category">
        <Input
          id="category"
          value={draft.category}
          onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
          placeholder="e.g. Orders & shipping"
          required
        />
      </FormField>
      <FormField label="Question" htmlFor="question">
        <Input
          id="question"
          value={draft.question}
          onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))}
          required
        />
      </FormField>
      <FormField label="Answer" htmlFor="answer">
        <Textarea
          id="answer"
          value={draft.answer}
          onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))}
          required
        />
      </FormField>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function ArticleRow({
  article,
  saving,
  onUpdate,
  onDelete,
}: {
  article: KnowledgeArticle;
  saving: boolean;
  onUpdate: (id: string, draft: KnowledgeArticleDraft) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <Card className="p-card">
        <ArticleForm
          initial={article}
          saving={saving}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={(draft) => {
            onUpdate(article.id, draft);
            setEditing(false);
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="p-card">
      <p className="text-caption font-medium text-primary">{article.category}</p>
      <p className="mt-1 font-medium text-foreground">{article.question}</p>
      <p className="mt-1 text-body-sm text-muted-foreground">{article.answer}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(article.id)} disabled={saving}>
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default function KnowledgeAdminPage() {
  const { articles, loading, saving, create, update, remove } = useKnowledgeAdmin();

  if (loading) {
    return (
      <>
        <PageHeader title="Knowledge base" description="Manage the Q&A content the chatbot answers from." />
        <p className="text-body-sm text-muted-foreground">Loading...</p>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Knowledge base" description="Manage the Q&A content the chatbot answers from." />

      <div className="flex flex-col gap-6">
        <Card className="p-card-lg">
          <h2 className="font-semibold text-foreground">Add an article</h2>
          <div className="mt-4">
            <ArticleForm initial={emptyDraft} saving={saving} submitLabel="Add article" onSubmit={create} />
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          {articles.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No articles yet — add one above.</p>
          ) : (
            articles.map((article) => (
              <ArticleRow key={article.id} article={article} saving={saving} onUpdate={update} onDelete={remove} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
