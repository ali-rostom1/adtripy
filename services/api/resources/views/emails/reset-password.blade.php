@component('mail::message')
# Reset Your Password

You are receiving this email because we received a password reset request for your account.

@component('mail::button', ['url' => config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($email)])
Reset Password
@endcomponent

This password reset link will expire in 60 minutes.

If you did not request a password reset, no further action is required.

Regards,<br>
{{ config('app.name') }}

<p style="font-size: 12px; color: #718096; margin-top: 10px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
<p style="font-size: 12px; color: #718096;">{{ config('app.frontend_url') }}/reset-password?token={{ $token }}&email={{ urlencode($email) }}</p>
@endcomponent