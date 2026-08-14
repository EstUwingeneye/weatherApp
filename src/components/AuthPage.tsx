import { zodResolver } from "@hookform/resolvers/zod";
import { CloudSun, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../context/authContextCore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Name must be at least 2 characters."),
    confirmPassword: z.string().min(6, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export function AuthPage() {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function submitLogin(values: LoginFormValues) {
    setSubmitError(null);
    try {
      await login(values);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  async function submitRegister(values: RegisterFormValues) {
    setSubmitError(null);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  async function handleGoogleLogin() {
    setSubmitError(null);
    try {
      await loginWithGoogle();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-panel">
        <div className="auth-brand">
          <CloudSun size={34} strokeWidth={2} />
          <div>
            <h1>Weatherly</h1>
            <p>{mode === "login" ? "Welcome back." : "Create your weather profile."}</p>
          </div>
        </div>

        <div className="auth-tabs" aria-label="Authentication mode">
          <button
            className={mode === "login" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => {
              setMode("login");
              setSubmitError(null);
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => {
              setMode("register");
              setSubmitError(null);
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <button className="oauth-button" onClick={handleGoogleLogin} type="button">
          <LogIn size={18} />
          Continue with Google
        </button>

        <div className="auth-divider">or</div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={loginForm.handleSubmit(submitLogin)}>
            <label>
              Email
              <input type="email" autoComplete="email" {...loginForm.register("email")} />
              {loginForm.formState.errors.email && (
                <span>{loginForm.formState.errors.email.message}</span>
              )}
            </label>
            <label>
              Password
              <input type="password" autoComplete="current-password" {...loginForm.register("password")} />
              {loginForm.formState.errors.password && (
                <span>{loginForm.formState.errors.password.message}</span>
              )}
            </label>
            {submitError && <p className="auth-error">{submitError}</p>}
            <button className="auth-submit" disabled={loginForm.formState.isSubmitting} type="submit">
              {loginForm.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={registerForm.handleSubmit(submitRegister)}>
            <label>
              Name
              <input type="text" autoComplete="name" {...registerForm.register("name")} />
              {registerForm.formState.errors.name && (
                <span>{registerForm.formState.errors.name.message}</span>
              )}
            </label>
            <label>
              Email
              <input type="email" autoComplete="email" {...registerForm.register("email")} />
              {registerForm.formState.errors.email && (
                <span>{registerForm.formState.errors.email.message}</span>
              )}
            </label>
            <label>
              Password
              <input type="password" autoComplete="new-password" {...registerForm.register("password")} />
              {registerForm.formState.errors.password && (
                <span>{registerForm.formState.errors.password.message}</span>
              )}
            </label>
            <label>
              Confirm password
              <input
                type="password"
                autoComplete="new-password"
                {...registerForm.register("confirmPassword")}
              />
              {registerForm.formState.errors.confirmPassword && (
                <span>{registerForm.formState.errors.confirmPassword.message}</span>
              )}
            </label>
            {submitError && <p className="auth-error">{submitError}</p>}
            <button className="auth-submit" disabled={registerForm.formState.isSubmitting} type="submit">
              {registerForm.formState.isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
