type InputType = 'number' | 'double' | 'phone' | 'email';
type FormPropType = {
  values: string;
  name: string;
  type: InputType;
};
//
export default class Validator {
  private static numberRegex = /^[0-9]+$/;
  private static decimalRegex = /^[0-9]\d*\.?\d*$/;
  private static emailRegex = /^\S+@\S+$/;
  //
  static numberValidator(value: any) {
    if (value.toString().match(this.numberRegex) || value == '') {
      return true;
    } else {
      return false;
    }
  }
  //
  static decimalValidator(value: any) {
    if (value.toString().match(this.decimalRegex) || value == '') {
      return value;
    }
  }
  //
  static formValidator({ name, type, values }: FormPropType): string | null {
    var message: string | null = null;
    switch (type) {
      case 'number': {
        if (values.match(this.numberRegex) || values == '') {
          message = null;
        } else {
          message = 'Please Enter Valid Number';
        }
        break;
      }
      case 'double': {
        if (values.match(this.decimalRegex) || values == '') {
          message = null;
        } else {
          message = 'Please Enter Valid Number';
        }
        break;
      }
      case 'email': {
        if (values.match(this.emailRegex) || values == '') {
          message = null;
        } else {
          message = 'Please Enter Valid Email';
        }
      }
      case 'phone': {
        if (values.charAt(0) != '0') {
          message = 'Phone number must start with 0 (e.g. 03xx)';
          break;
        }
        //
        if (values.length > 11) {
          message = 'Phone number cannot be greater than 11!';
          break;
        }
        //
        if (!values.match(this.numberRegex) || values != '') {
          message = 'Please Enter Valid Phone Number';
          break;
        }
        break;
      }
      default: {
        break;
      }
    }
    return message;
  }
}
