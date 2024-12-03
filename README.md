# FindPerfectNest

## 1. Project Overview:

   FindPerfectNest the ultimate tool for navigating the real estate market with ease. Designed for buyers, sellers, and renters, FindPerfectNest simplifies the property search process with an extensive database of listings, complete with detailed descriptions, high-quality images. Our app's intuitive search filters help you quickly find properties that match your criteria, while real-time notifications keep you updated on new listings and market trends. Whether you're looking for your first home, an investment property, or a rental, FindPerfectNest offers a seamless and efficient experience from start to finish.

## 3. Project Structure:

   FindPerfectNest/
   ├── client/       # React frontend
   
   ├── api/          # Node.js backend
   
   ├── socket/       # WebSocket server
   
   └── README.md     # Documentation

## 4. Prerequisites:

   - Install Node.js, npm, socket, and MongoDB.

## 6. Installation Steps:

   - Clone the repository:
     ```bash
     git clone https://github.com/your-repo/findPerfectNest.git
     cd findPerfectNest
     ```
   - Install dependencies for each folder:
     ```bash
     cd client && npm install
     cd ../api && npm install
     cd ../socket && npm install
     ```

## 7. Configuration:

   - Add environment variables:
     - API: Database connection string, e.g., `MONGO_URI`.
     - Client: Update API and WebSocket URLs in `.env`.

## 8. Run the Project:
   
   - Client: 
     ```bash
     cd client
     npm run dev
     ```
   - API: 
     ```bash
     cd api
     node app.js
     ```
   - Socket:
     ```bash
     cd socket
     node app.js
     ```

## 9. Access the Website:
   - FindPerfectNest : [http://localhost:5173/](http://localhost:5173/)   
