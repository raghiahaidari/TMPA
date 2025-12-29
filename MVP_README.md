# MVP Project: FastAPI Backend & React+MUI Frontend

## Structure

- `mvp-backend/`: FastAPI app providing RESTful CRUD API for vehicle operations, backed by SQLite
- `mvp-frontend/`: React app (Vite + Material UI) for database-driven vehicle management

---

## Backend Setup (FastAPI + SQLite)

1. **Install Python dependencies**

    ```bash
    cd mvp-backend
    source venv/bin/activate  # (if not already activated)
    pip install -r requirements.txt
    ```

2. **Start the server**

    ```bash
    uvicorn main:app --reload --port 8000
    ```

    - The API will be available at [http://localhost:8000](http://localhost:8000)
    - **Vehicle endpoints**:
        - `GET /vehicles` - List all vehicles
        - `POST /vehicles` - Add new vehicle (JSON body)
        - `PUT /vehicles/{id}` - Update vehicle by ID
        - `DELETE /vehicles/{id}` - Delete vehicle by ID

    - REST API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

    - **Data is persisted in the SQLite file**: `mvp-backend/vehicles.db`

---

## Frontend Setup (React + Vite + MUI)

1. **Install Node dependencies**

    ```bash
    cd mvp-frontend
    npm install
    ```

2. **Run the frontend dev server**

    ```bash
    npm run dev
    ```

    - The app will be available at the localhost URL shown by Vite (ex: [http://localhost:5173](http://localhost:5173))
    - By default, it connects to the backend at [http://localhost:8000](http://localhost:8000)

---

## Usage Workflow

1. **Start the backend** (`uvicorn main:app --reload --port 8000`)
2. **Start the frontend** (`npm run dev`)
3. **Open the web app** ([http://localhost:5173](http://localhost:5173) or similar)
4. **Add new vehicles** using the form in the UI
    - All vehicle records are stored in the database via API (no CSV upload/import!)
    - Vehicle table displays up-to-date database contents

---

## Notes

- No CSV dependencies remain: all vehicle data is entered and managed through the web UI and REST API.
- For development or demo, SQLite DB is persisted as `vehicles.db` in the backend directory.
- For production, consider a full database (PostgreSQL, MySQL, etc.) and proper user authentication.
- For API schema details, explore the backend at [http://localhost:8000/docs](http://localhost:8000/docs).

---

Enjoy your fully database-powered, modern fullstack MVP!
