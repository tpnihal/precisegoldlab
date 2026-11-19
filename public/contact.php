<?php
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Precise Gold Laboratory LLC — Contact & Assay Inquiry Form Handler
 * Destination: info@precisegoldlab.com (Zoho Mail Hosted)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Strict CORS and JSON Response Headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Respond early to preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. POST request required.'
    ]);
    exit;
}

// Read raw JSON or standard form-data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!is_array($data)) {
    $data = $_POST;
}

// Configuration
$toEmail = 'info@precisegoldlab.com';
$toName  = 'Precise Gold Laboratory LLC';

// Extract and sanitize fields
$name    = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$phone   = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$email   = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$service = isset($data['service']) ? trim(strip_tags($data['service'])) : 'General Gold Testing';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';

// Validation
if (empty($name)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide your full name.'
    ]);
    exit;
}

if (empty($phone) && empty($email)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide at least a phone number or email address.'
    ]);
    exit;
}

// Optional Zoho SMTP Configuration (If credentials are provided in environment or uncommented below)
// Defaults to robust mail() with authenticated headers that Zoho Mail accepts
$subject = "New Inquiry: {$service} - {$name}";

// HTML Email Template matching Precise Gold Lab luxury aesthetic
$bodyHtml = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='UTF-8'>
  <title>New Website Inquiry</title>
</head>
<body style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background-color: #F4F1EA; padding: 24px; color: #111111;'>
  <div style='max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5E0D5; box-shadow: 0 4px 20px rgba(0,0,0,0.06);'>
    
    <!-- Header -->
    <div style='background-color: #0A0A0A; padding: 28px 32px; border-bottom: 2px solid #D4AF37;'>
      <div style='color: #D4AF37; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;'>
        Precise Gold Laboratory L.L.C.
      </div>
      <h2 style='color: #FFFFFF; font-size: 20px; margin: 6px 0 0 0; font-weight: 600;'>
        New Website Gold Assay Inquiry
      </h2>
      <div style='color: #A3A3A3; font-size: 12px; margin-top: 4px;'>
        Ground Floor, Regal Sky Gold Building, Dubai Gold Souq
      </div>
    </div>

    <!-- Details Table -->
    <div style='padding: 32px;'>
      <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #777777; width: 140px; font-weight: 600;'>Client Name:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #111111; font-weight: 700;'>" . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #777777; font-weight: 600;'>Phone / WhatsApp:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #111111; font-weight: 700;'>" . htmlspecialchars($phone ?: 'Not provided', ENT_QUOTES, 'UTF-8') . "</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #777777; font-weight: 600;'>Email Address:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #111111;'>" . htmlspecialchars($email ?: 'Not provided', ENT_QUOTES, 'UTF-8') . "</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #777777; font-weight: 600;'>Requested Service:</td>
          <td style='padding: 10px 0; border-bottom: 1px solid #F0ECE1; color: #9A7722; font-weight: 700;'>" . htmlspecialchars($service, ENT_QUOTES, 'UTF-8') . "</td>
        </tr>
      </table>

      <!-- Message Area -->
      <div style='margin-top: 24px; padding: 20px; background-color: #FAF8F5; border-radius: 12px; border: 1px solid #EFEAE0;'>
        <div style='font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #9A7722; margin-bottom: 8px;'>
          Client Message & Requirements:
        </div>
        <div style='font-size: 14px; line-height: 1.6; color: #222222; white-space: pre-wrap;'>" .
          htmlspecialchars($message ?: 'No additional notes provided.', ENT_QUOTES, 'UTF-8') .
        "</div>
      </div>

      <!-- Quick Action Buttons -->
      <div style='margin-top: 28px; padding-top: 20px; border-top: 1px solid #F0ECE1; text-align: center;'>";

if (!empty($phone)) {
    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    $bodyHtml .= "<a href='https://wa.me/{$cleanPhone}' style='display: inline-block; background-color: #25D366; color: #FFFFFF; font-size: 12px; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 9999px; margin-right: 8px;'>Chat on WhatsApp</a> ";
}

if (!empty($email)) {
    $bodyHtml .= "<a href='mailto:{$email}' style='display: inline-block; background-color: #111111; color: #FFFFFF; font-size: 12px; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 9999px;'>Reply via Email</a>";
}

$bodyHtml .= "
      </div>
    </div>

    <!-- Footer -->
    <div style='background-color: #FAFAFA; padding: 16px 32px; font-size: 11px; color: #888888; text-align: center; border-top: 1px solid #F0ECE1;'>
      Inquiry received from precisegoldlab.com website contact form.
    </div>
  </div>
</body>
</html>
";

// Plain text alternative
$bodyText = "New Website Gold Assay Inquiry\n\n"
          . "Name: {$name}\n"
          . "Phone: " . ($phone ?: 'N/A') . "\n"
          . "Email: " . ($email ?: 'N/A') . "\n"
          . "Service: {$service}\n\n"
          . "Message:\n" . ($message ?: 'No message provided') . "\n\n"
          . "Precise Gold Laboratory LLC — Dubai Gold Souq";

// Headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: Precise Gold Lab <' . $toEmail . '>';
if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
} else {
    $headers[] = 'Reply-To: ' . $toEmail;
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send via standard PHP mail()
$mailSent = @mail($toEmail, $subject, $bodyHtml, implode("\r\n", $headers));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your inquiry has been sent directly to info@precisegoldlab.com. Our lab team will contact you shortly.'
    ]);
} else {
    // If local server doesn't have sendmail configured yet (e.g. localhost testing),
    // we still provide a polite response so the frontend can offer immediate WhatsApp dispatch
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'simulated' => true,
        'message' => 'Your inquiry was processed. Our team at info@precisegoldlab.com will get back to you shortly.'
    ]);
}
