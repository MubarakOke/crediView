# CrediViewer

## Description

The Verifiable Credential Viewer is a browser extension designed to simplify the process of viewing and validating JSON-based digital credentials. It provides a user-friendly interface for professionals and individuals working with verifiable credentials, digital identities, and blockchain certificates.

### Key Features

- Easy credential input through drag-and-drop file upload, direct pasting, or manual entry
- Automatic JSON detection and validation
- Support for various verifiable credential standards and formats
- Real-time parsing and display of credential contents
- Clean, distraction-free interface with a modern grayscale gradient design

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Building the Extension](#building-the-extension)
- [Installing as a Browser Extension](#installing-as-a-browser-extension)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project for development:

1. Clone the repository

2. Enter the project directory:
   ```cd <project directory>```

3. Install dependencies:
   ```npm install```

## Usage
To run the project in development mode:
   ```npm run dev```
   
   This will start the development server, typically at `http://localhost:3000`.

## Building the Extension

To build the extension for production:

1. Run the build command:
   ```npm run build```
   
   This should generate a 'build' folder in the project directory

## Installing as a Browser Extension

After building the project:

1. Open your browser's extension page:
- Chrome: Navigate to `chrome://extensions`
- Firefox: Navigate to `about:addons`
- Edge: Navigate to `edge://extensions`

2. Enable "Developer mode" (usually a toggle switch in the top right corner).

3. Click on "Load unpacked" (Chrome/Edge) or "Load Temporary Add-on" (Firefox).

4. Navigate to your project directory and select the `build` folder.

The Verifiable Credential Viewer should now be installed as a browser extension.

## Development

This project is built using:

- Next.js
- React
- Tailwind CSS

To start developing:

1. Make changes in the `src` directory.
2. Use `npm run dev` to see changes in real-time.
3. Test your changes thoroughly.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

See the License directory for details.