import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureOrToday(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureOrToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return inputDate >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là ngày hôm nay hoặc trong tương lai.`;
        },
      },
    });
  };
}
