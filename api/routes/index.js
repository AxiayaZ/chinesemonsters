router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
}); 