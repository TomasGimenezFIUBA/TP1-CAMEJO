import { defineConfig } from 'vite';
// esto esta para resolver el error al buildear ya que vite tiene conflicto con fsevents
export default defineConfig({
  plugins: [
    {
      name: 'ignore-fsevents',
      resolveId(id) {
        if (id.includes('fsevents')) {
          return id;
        }
      },
      load(id) {
        if (id.includes('fsevents')) {
          return '';
        }
      },
    }
  ],
});
