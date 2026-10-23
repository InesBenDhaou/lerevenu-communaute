/** Route personnalisée : GET /api/discussions/slug/:slug (URL propre côté frontend). */
export default {
  routes: [
    {
      method: 'GET',
      path: '/discussions/slug/:slug',
      handler: 'discussion.findBySlug',
    },
  ],
};
