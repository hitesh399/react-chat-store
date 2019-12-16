module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    name: 'rect-chat',
    format: 'umd'
  },
  external: [
    'react', 
    'react-proptypes',
    'react-redux',
    'prop-types'
  ]
};