# MVP Project: FastAPI Backend & React+MUI Frontend

## Structure

- `mvp-backend/`: FastAPI app providing RESTful CRUD API for vehicle operations, backed by SQLite
- `mvp-frontend/`: React app (Vite + Material UI) for database-driven vehicle management

---

## Backend Setup (FastAPI + SQLite)

1. **Install Python dependencies**

    ```bash
    cd mvp-backend
    python3 -m venv venv
    source venv/bin/activate     # for linux
    venv\Scripts\Activate.ps1    # for windows
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
