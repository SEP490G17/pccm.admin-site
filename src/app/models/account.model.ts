export class LoginDto {
  username: string = '';
  password: string = '';

  constructor(data?: Partial<LoginDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class UpdateProfileDto {
  birthDate: string | null = null;
  email: string = '';
  firstName: string = '';
  imageUrl: string | null = null;
  lastName: string = '';
  phoneNumber: string = '';
  gender: boolean | null = null;

  constructor(data?: Partial<UpdateProfileDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class RegisterDto {
  email: string = '';
  password: string = '';
  displayName: string = '';
  username: string = '';
  phoneNumber: string = '';
  firstName?: string = '';
  lastName?: string = '';

  constructor(data?: Partial<RegisterDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ForgotPasswordDto {
  email: string = '';

  constructor(data?: Partial<ForgotPasswordDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ConfirmForgotPasswordDto {
  token: string = '';
  newPassword: string = '';

  constructor(data?: Partial<ConfirmForgotPasswordDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class ChangePasswordInput {
  currentPassword: string = '';
  newPassword: string = '';

  constructor(data?: Partial<ChangePasswordInput>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
