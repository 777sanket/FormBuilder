# FormBuilder

A simple  form builder application that allows you to create, edit, and collect responses from custom forms. Built with React for the frontend and Node.js/Express/MongoDB for the backend.

## Features

- Create customizable forms with various input types
- Edit existing forms
- Collect and view form responses
- Drag and drop interface for reordering form elements
- Responsive design that works on all devices


## Tech Stack

### Frontend
- React
- React Router
- CSS Modules

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/FormBuilder.git
   cd FormBuilder
   ```

2. Install dependencies for both frontend and backend
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd fronted
   npm install
   cd ..
   ```

3. Create a `.env` file in the backend directory with the following variables
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/formbuilder
   ```

## Running the Application

### Development Mode

1. Start the backend server
   ```bash
   cd backend
   npm start
   ```

2. In a separate terminal, start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:<Port No Assigned>`



## Usage

1. **Creating a Form**
   - Click on "CREATE NEW FORM" on the homepage
   - Add a title to your form
   - Add form elements by clicking "Add Element" and selecting the desired input type
   - Configure each element with labels and placeholder text
   - Drag and drop elements to reorder them
   - Click "Save Form" when you're done

2. **Editing a Form**
   - From the homepage, find the form you want to edit
   - Click the "Edit" button
   - Make your changes
   - Click "Update Form" to save your changes

3. **Viewing a Form**
   - From the homepage, find the form you want to view
   - Click the "View" button
   - The form will be displayed as it would appear to users

4. **Submitting Responses**
   - Navigate to the form you want to a response to submit by clicking view button 
   - Fill out the form fields
   - Click "Submit"

5. **Viewing Responses**
   - From the homepage, find the form whose responses you want to view
   - Click the "Responses" button
   - View a list of all submissions and their details



