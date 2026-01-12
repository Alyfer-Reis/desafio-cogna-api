import { validateSync, ValidationError } from 'class-validator';
import { randomUUID } from 'node:crypto';
import {
  DataIntegrityError,
  InputValidationError,
} from '../error/domain-validation-error';

export abstract class Entity {
  public readonly id: string;

  constructor(id: string | null) {
    if (!id) this.id = randomUUID();
    else this.id = id;
  }

  private static formatErrors(errors: ValidationError[]) {
    return errors.map((err) => ({
      field: err.property,
      message: Object.values(err.constraints || {})[0],
    }));
  }

  protected static validateCreate<T extends object>(validator: T): void {
    const errors = validateSync(validator);
    if (errors.length > 0) {
      throw new InputValidationError(this.formatErrors(errors));
    }
  }

  protected static validateReconstruct<T extends object>(validator: T): void {
    const errors = validateSync(validator);
    if (errors.length > 0) {
      throw new DataIntegrityError(this.formatErrors(errors));
    }
  }
}
