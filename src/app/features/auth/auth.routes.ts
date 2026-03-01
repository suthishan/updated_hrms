import { Routes } from '@angular/router';

export const Auth_routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path: '', loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
    children: [
    { path: 'signin', loadComponent: () => import('./signin/signin.component').then(m => m.SigninComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    { path: 'login-2', loadComponent: () => import('./login-2/login-2.component').then(m => m.Login2Component) },
    { path: 'login-3', loadComponent: () => import('./login-3/login-3.component').then(m => m.Login3Component) },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) },
    { path: 'otp', loadComponent: () => import('./otp/otp.component').then(m => m.OtpComponent) },
    { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    { path: 'forgot-password-2', loadComponent: () => import('./forgot-password-2/forgot-password-2.component').then(m => m.ForgotPassword2Component) },
    { path: 'forgot-password-3', loadComponent: () => import('./forgot-password-3/forgot-password-3.component').then(m => m.ForgotPassword3Component) },
    { path: 'password-strength', loadComponent: () => import('./password-strength/password-strength.component').then(m => m.PasswordStrengthComponent) },
    { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
    { path: 'reset-password-2', loadComponent: () => import('./reset-password-2/reset-password-2.component').then(m => m.ResetPassword2Component) },
    { path: 'reset-password-3', loadComponent: () => import('./reset-password-3/reset-password-3.component').then(m => m.ResetPassword3Component) },
    { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
    { path: 'register-2', loadComponent: () => import('./register-2/register-2.component').then(m => m.Register2Component) },
    { path: 'register-3', loadComponent: () => import('./register-3/register-3.component').then(m => m.Register3Component) },
    { path: 'email-verification', loadComponent: () => import('./email-verification/email-verification.component').then(m => m.EmailVerificationComponent) },
    { path: 'email-verification-2', loadComponent: () => import('./email-verification-2/email-verification-2.component').then(m => m.EmailVerification2Component) },
    { path: 'email-verification-3', loadComponent: () => import('./email-verification-3/email-verification-3.component').then(m => m.EmailVerification3Component) },
    { path: 'two-step-verification', loadComponent: () => import('./two-step-verification/two-step-verification.component').then(m => m.TwoStepVerificationComponent) },
    { path: 'two-step-verification-2', loadComponent: () => import('./two-step-verification-2/two-step-verification-2.component').then(m => m.TwoStepVerification2Component) },
    { path: 'two-step-verification-3', loadComponent: () => import('./two-step-verification-3/two-step-verification-3.component').then(m => m.TwoStepVerification3Component) },
    { path: 'success', loadComponent: () => import('./success/success.component').then(m => m.SuccessComponent) },
    { path: 'success-2', loadComponent: () => import('./success-2/success-2.component').then(m => m.Success2Component) },
    { path: 'success-3', loadComponent: () => import('./success-3/success-3.component').then(m => m.Success3Component) },
    { path: 'lock-screen', loadComponent: () => import('./lock-screen/lock-screen.component').then(m => m.LockScreenComponent) },
    { path: 'error-404', loadComponent: () => import('./error-404/error-404.component').then(m => m.Error404Component) },
    { path: 'error-500', loadComponent: () => import('./error-500/error-500.component').then(m => m.Error500Component) }
  ]
    }
]