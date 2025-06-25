@component('mail::message')
# Verify Your Email Address

Hi {{ $user->firstName }},

Thank you for registering with Adtripy. Please click the button below to verify your email address:

@component('mail::button', ['url' => $verificationUrl])
Verify Email Address
@endcomponent

If you did not create an account, no further action is required.

Regards,<br>
{{ config('app.name') }}

<p style="font-size: 12px; color: #718096; margin-top: 10px;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
<p style="font-size: 12px; color: #718096;">{{ $verificationUrl }}</p>
@endcomponent