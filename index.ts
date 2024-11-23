// Базовий інтерфейс для контенту
interface BaseContent {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
  }
  
  // Розширення для різних типів контенту
  interface Article extends BaseContent {
    title: string;
    content: string;
    author: string;
    category: string;
  }
  
  interface Product extends BaseContent {
    name: string;
    description: string;
    price: number;
  }
  
  // Generic тип для операцій з контентом
  type ContentOperations<T extends BaseContent> = {
    create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T;
    read: (id: string) => T | null;
    update: (id: string, data: Partial<T>) => T | null;
    delete: (id: string) => boolean;
  };
  //Визначені баазові ролі та права
  type Role = 'admin' | 'editor' | 'viewer';
  
  type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  
  type AccessControl<T extends BaseContent> = {
    role: Role;
    permissions: Record<keyof ContentOperations<T>, boolean>;
  };
  
  // Система валідації
  type ValidationResult = {
    isValid: boolean;
    errors?: string[];
  };
  
  type Validator<T> = {
    validate: (data: T) => ValidationResult;
  };
  
  type CompositeValidator<T> = {
    validators: Validator<T>[];
    validate: (data: T) => ValidationResult;
  };
  
  // Приклад валідатора для статей
  const articleValidator: Validator<Article> = {
    validate: (data) => {
      const errors: string[] = [];
      if (!data.title || data.title.trim() === '') errors.push('Title is required.');
      if (!data.content || data.content.trim() === '') errors.push('Content is required.');
      if (!data.author || data.author.trim() === '') errors.push('Author is required.');
      if (!data.category || data.category.trim() === '') errors.push('Category is required.');
      return { isValid: errors.length === 0, errors };
    },
  };
  
  const compositeArticleValidator: CompositeValidator<Article> = {
    validators: [articleValidator],
    validate: (data) => {
      const results = compositeArticleValidator.validators.map((v) => v.validate(data));
      const errors = results.flatMap((r) => r.errors || []);
      return { isValid: errors.length === 0, errors };
    },
  };
  
  // Система версіонування
  type Versioned<T extends BaseContent> = T & {
    version: number;
    changeLog: string[];
  };
  
  type VersionControl<T extends BaseContent> = {
    createNewVersion: (content: T, changeLog: string) => Versioned<T>;
    getVersionHistory: (content: Versioned<T>) => string[];
  };
  
  const versionControl: VersionControl<Article> = {
    createNewVersion: (content, changeLog) => ({
      ...content,
      version: (content as Versioned<Article>).version + 1 || 1,
      changeLog: [...((content as Versioned<Article>).changeLog || []), changeLog],
    }),
    getVersionHistory: (content) => (content as Versioned<Article>).changeLog || [],
  };