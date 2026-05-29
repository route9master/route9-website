<?php
/**
 * 루트9 (Route9) — contact.php
 * 문의 폼 메일 전송 처리
 *
 * 서버 요구사항: PHP 7.4+, mail() 또는 SMTP 설정
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

/* ── Input 수집 ── */
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    $data = $_POST;
}

/* ── 필수값 검증 ── */
$company = trim($data['company'] ?? '');
$email   = trim($data['email']   ?? '');
$phone   = trim($data['phone']   ?? '');
$url     = trim($data['url']     ?? '');
$message = trim($data['message'] ?? '');

if (!$company || !$email || !$phone || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '필수 항목이 누락되었습니다.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => '올바른 이메일 주소를 입력해주세요.']);
    exit;
}

/* ── XSS 방지 ── */
$company = htmlspecialchars($company, ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone,   ENT_QUOTES, 'UTF-8');
$url     = htmlspecialchars($url,     ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

/* ── 수신 이메일 설정 ── */
$to      = 'route9master@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode("[루트9 상담 신청] {$company}") . '?=';

$date = date('Y-m-d H:i:s', time() + 9 * 3600); // KST

/* ── 메일 본문 ── */
$body = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
$body .= "  루트9 (Route9) 광고 상담 신청\n";
$body .= "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
$body .= "■ 접수일시: {$date}\n\n";
$body .= "■ 업체명: {$company}\n";
$body .= "■ 이메일: {$email}\n";
$body .= "■ 연락처: {$phone}\n";
$body .= "■ 사이트: " . ($url ?: '입력 없음') . "\n\n";
$body .= "■ 문의내용:\n";
$body .= str_repeat("─", 40) . "\n";
$body .= $message . "\n";
$body .= str_repeat("─", 40) . "\n\n";
$body .= "루트9 (Route9) 공식 홈페이지 문의 시스템\n";
$body .= "Tel: 02-2088-4840 | route9master@gmail.com\n";

/* ── 메일 헤더 ── */
$headers  = "From: =?UTF-8?B?" . base64_encode("루트9 홈페이지") . "?= <noreply@route9.co.kr>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

/* ── 발송 ── */
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    /* 신청자에게 자동 회신 */
    $autoSubject = '=?UTF-8?B?' . base64_encode("[루트9] 상담 신청이 접수되었습니다") . '?=';
    $autoBody  = "{$company} 담당자님, 안녕하세요.\n";
    $autoBody .= "루트9에 상담 신청해주셔서 감사합니다.\n\n";
    $autoBody .= "신청하신 내용을 확인하였으며, 영업일 기준 24시간 내에 연락드리겠습니다.\n\n";
    $autoBody .= "■ 접수 내용\n";
    $autoBody .= "업체명: {$company}\n";
    $autoBody .= "연락처: {$phone}\n\n";
    $autoBody .= "빠른 상담을 원하시면 아래로 직접 연락해주세요.\n";
    $autoBody .= "Tel: 02-2088-4840\n";
    $autoBody .= "평일 09:00 ~ 18:00\n\n";
    $autoBody .= "감사합니다.\n";
    $autoBody .= "루트9 (Route9) 드림\n";
    $autoBody .= "서울시 금천구 디지털로9길 99, 1304-B호(스타밸리)\n";

    $autoHeaders  = "From: =?UTF-8?B?" . base64_encode("루트9 (Route9)") . "?= <route9master@gmail.com>\r\n";
    $autoHeaders .= "MIME-Version: 1.0\r\n";
    $autoHeaders .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $autoHeaders .= "Content-Transfer-Encoding: 8bit\r\n";

    mail($email, $autoSubject, $autoBody, $autoHeaders);

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => '상담 신청이 완료되었습니다.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '메일 전송에 실패했습니다. 직접 연락 부탁드립니다.']);
}
