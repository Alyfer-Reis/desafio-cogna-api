export interface FieldError {
  field: string;
  message: string;
}

export class InputValidationError extends Error {
  public readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('Erro de validação:');
    this.name = 'InputValidationError';
    this.errors = errors;
  }
}

export class DataIntegrityError extends Error {
  public readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super('Falha de integridade nos dados recuperados do banco de dados');
    this.name = 'DataIntegrityError';
    this.errors = errors;
  }
}
