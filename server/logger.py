import logging
import os
from logging.handlers import RotatingFileHandler

from config import settings

# Create logs directory if it doesn't exist
logs_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(logs_dir, exist_ok=True)

# Configure logging
log_level = settings.log_level
log_file = settings.log_file

# Create a logger
logger = logging.getLogger("zyarat")
logger.setLevel(getattr(logging, log_level))

# Clear any existing handlers (to avoid duplication)
if logger.handlers:
    logger.handlers.clear()

# Create formatters
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# Create console handler and set level
console_handler = logging.StreamHandler()
console_handler.setLevel(getattr(logging, log_level))
console_handler.setFormatter(console_formatter)

# Create file handler and set level (10MB max file size, keep 5 backup files)
file_handler = RotatingFileHandler(
    log_file,
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5
)
file_handler.setLevel(getattr(logging, log_level))
file_handler.setFormatter(file_formatter)

# Add handlers to logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.info(f"Logging to file: {log_file} (level: {log_level})")
