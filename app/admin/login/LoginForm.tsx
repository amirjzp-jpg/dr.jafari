"use client";

import { useActionState } from "react";
import { adminLogin, type LoginState } from "../actions";

const input = "h-14 rounded-[14px] border border-line bg-surface px-4 text-lg text-ink";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(adminLogin, { step: "phone", phone: "" });

  return (
    <form action={action} className="flex flex-col gap-4">
      {state.step === "phone" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            شماره موبایل
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            required
            defaultValue={state.phone}
            placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
            className={`${input} text-left`}
            aria-describedby={state.error ? "login-error" : undefined}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-sm font-medium">
            کد ورود
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={5}
            dir="ltr"
            required
            autoFocus
            className={`${input} text-center tracking-[12px]`}
            aria-describedby={state.error ? "login-error" : "login-info"}
          />
          {state.info && (
            <p id="login-info" className="text-sm text-muted">
              {state.info}
            </p>
          )}
        </div>
      )}
      {state.error && (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-14 rounded-pill bg-primary text-base font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted"
      >
        {pending ? "لطفاً صبر کنید…" : state.step === "phone" ? "دریافت کد ورود" : "ورود"}
      </button>
      {state.step === "code" && (
        <button type="submit" name="resend" value="1" formNoValidate className="text-sm text-primary">
          ارسال دوباره‌ی کد
        </button>
      )}
    </form>
  );
}
