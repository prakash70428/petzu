export interface KnowledgeArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeArticleDraft {
  category: string;
  question: string;
  answer: string;
}
