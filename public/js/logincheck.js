(async () => {
    try {
        if (localStorage.getItem('token')) {
            const check = await axios({
                method: 'GET',
                url: '/api/member/find',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (check) {
                window.history.back();
            }
        }
    } catch {
        return;
    }
})();
