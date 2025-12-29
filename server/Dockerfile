# 1. Use a lightweight Python image
FROM python:3.11-slim

# 2. Set the working directory
WORKDIR /app/server

# 3. Install system dependencies
# We need build-essential for some Backtrader/Python dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of the code
COPY . .

# 6. Create the results directory and set permissions
# This prevents the "Permission Denied" when deleting, creating or altering files
RUN mkdir -p backtest_runs && chmod -R 777 backtest_runs

# 7. Flask port
EXPOSE 5000