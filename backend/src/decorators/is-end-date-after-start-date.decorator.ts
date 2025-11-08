import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEndDateAfterStartDate(startDateField: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const startDate = (args.object as any)[startDateField];
          if (!value || !startDate) return false;
          return new Date(value) > new Date(startDate);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải sau ${startDateField}.`;
        },
      },
    });
  };
}
