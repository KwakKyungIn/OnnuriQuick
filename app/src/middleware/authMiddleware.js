function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        // 로그인 상태라면 다음 미들웨어로 넘어감
        return next();
    } else {
        // 로그인되어 있지 않다면 로그인 페이지로 리다이렉트
        res.send(
            `<script>
                alert('로그인이 필요한 작업입니다. 로그인 창으로 이동합니다.');
                window.location.href = "/login";
            </script>`
        );
    }
}

module.exports = isLoggedIn;
