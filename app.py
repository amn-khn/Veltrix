from flask import Flask, jsonify, render_template

app = Flask(__name__)

PRODUCTS = [
    {
        "id": 1,
        "name": "Classic Oversized Tee",
        "category": "Fashion",
        "price": 799,
        "description": "Everyday comfort with a relaxed fit.",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
    },
    {
        "id": 2,
        "name": "Minimal Sneakers",
        "category": "Fashion",
        "price": 2499,
        "description": "Clean design for everyday wear.",
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 3,
        "name": "Wireless Headphones",
        "category": "Electronics",
        "price": 3499,
        "description": "Immersive sound for work and travel.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 4,
        "name": "Smart Watch",
        "category": "Electronics",
        "price": 4999,
        "description": "A smarter companion for every day.",
        "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 5,
        "name": "Ceramic Table Lamp",
        "category": "Home",
        "price": 1899,
        "description": "Soft lighting with a modern silhouette.",
        "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 6,
        "name": "Minimal Desk Organiser",
        "category": "Home",
        "price": 999,
        "description": "Keep your workspace neat and refined.",
        "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 7,
        "name": "Insulated Water Bottle",
        "category": "Lifestyle",
        "price": 699,
        "description": "A reusable companion for busy days.",
        "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85"
    },
    {
        "id": 8,
        "name": "Everyday Backpack",
        "category": "Lifestyle",
        "price": 1599,
        "description": "Practical storage with a minimalist look.",
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    }
]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/products")
def get_products():
    return jsonify(PRODUCTS)


@app.route("/health")
def health():
    return jsonify(status="healthy", application="Veltrix")


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)