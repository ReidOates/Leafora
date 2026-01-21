from flask import Flask, render_template, jsonify, request as flask_request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- MODELS ---
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    care = db.Column(db.Text, nullable=False)
    cat = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'stock': self.stock,
            'image': self.image,
            'description': self.description,
            'care': self.care,
            'cat': self.cat
        }

# --- SEED DATA (Original Data from script.js) ---
initial_products = [
    {
        "id": 1,
        "name": "Peace Lily (Spathiphyllum)",
        "price": 35.00,
        "stock": 50,
        "image": "../static/images/Peace Lily (Spathiphyllum).jpg",
        "description": "An elegant indoor favorite with dark green foliage and striking white spathes. Beyond its beauty, it is celebrated for its exceptional air-purifying qualities and graceful, calming presence.",
        "care": "Thrives in medium to low light; keep soil consistently moist but not waterlogged; it will 'tell' you it's thirsty by drooping its leaves.",
        "cat": "Indoor"
    },
    {
        "id": 2,
        "name": "Aglaonema Red Siam",
        "price": 45.00,
        "stock": 40,
        "image": "../static/images/Aglaonema Red Siam.jpg",
        "description": "Adding a pop of vibrant color, this Aglaonema features striking red-edged leaves against deep green centers. It is a hardy, low-maintenance plant perfect for brightening up dim corners of a home or office.",
        "care": "Tolerates low light but prefers medium indirect light for best color; water when the top half of the soil is dry; avoid overwatering.",
        "cat": "Indoor"
    },
    {
        "id": 3,
        "name": "Phalaenopsis White Orchid",
        "price": 60.00,
        "stock": 25,
        "image": "../static/images/Phalaenopsis White Orchid.jpg",
        "description": "Exuding sophistication, this orchid displays long-lasting, snowy white blooms on elegant arching stems. It is the pinnacle of floral grace, suitable for minimalist and luxury interior settings.",
        "care": "Requires bright, filtered light; water sparingly (about once a week) avoiding the crown; use orchid-specific bark or moss medium.",
        "cat": "Indoor"
    },
    {
        "id": 4,
        "name": "Royal Evergreen Bonsai",
        "price": 400.00,
        "stock": 20,
        "image": "../static/images/Royal Evergreen Bonsai.jpg",
        "description": "This handcrafted bonsai features a well-established root system and naturally curved branches that display a harmonious growth pattern. The compact size allows it to thrive as a stunning centerpiece in small outdoor spaces.",
        "care": "Place in a bright outdoor spot; water daily or when the soil surface feels dry; prune occasionally to maintain its artistic shape.",
        "cat": "Bonsai"
    },
    {
        "id": 5,
        "name": "Japanese Black Pine",
        "price": 250.00,
        "stock": 10,
        "image": "../static/images/Japanese Black Pine.jpeg",
        "description": "A masterpiece of strength and longevity, this bonsai showcases rugged bark and stiff, deep-green needles. Its dramatic, wired silhouette reflects the resilience of ancient pines clinging to coastal cliffs.",
        "care": "Requires full sun and high light intensity; allow the soil to dry slightly between waterings; needs a distinct winter dormancy period outdoors.",
        "cat": "Bonsai"
    },
    {
        "id": 6,
        "name": "Juniper Bonsai",
        "price": 72.00,
        "stock": 30,
        "image": "../static/images/Juniper Bonsai.jpg",
        "description": "Known for its elegant, flowing foliage and flexible trunk, this Juniper captures the essence of a windswept mountain tree. Its fine-textured needles provide a lush, year-round green aesthetic.",
        "care": "Must be kept outdoors; prefers full sun to partial shade; mist the foliage frequently and keep the soil moist but well-drained.",
        "cat": "Bonsai"
    },
    {
        "id": 7,
        "name": "Ficus Golden Coin",
        "price": 55.00,
        "stock": 15,
        "image": "../static/images/Ficus Golden Coin.jpg",
        "description": "This banyan-style bonsai is prized for its thick, exposed aerial roots and glossy, coin-shaped leaves. It offers a miniature tropical forest vibe that adds a touch of ancient wisdom to any garden collection.",
        "care": "Enjoys bright light and warm temperatures; water thoroughly when the soil is dry to the touch; very resilient to heavy pruning.",
        "cat": "Bonsai"
    },
    {
        "id": 8,
        "name": "Cactus Barrel",
        "price": 57.00,
        "stock": 12,
        "image": "../static/images/Cactus Barrel.jpg",
        "description": "A perfectly symmetrical, globe-shaped cactus adorned with sharp golden spines. This slow-growing desert gem is a sculptural marvel that requires minimal attention to maintain its striking form.",
        "care": "Needs 6+ hours of direct sunlight daily; water very sparingly (once every 3–4 weeks in summer, less in winter); use well-draining cactus soil.",
        "cat": "Cactus"
    },
    {
        "id": 9,
        "name": "Echeveria Blue Prince",
        "price": 30.00,
        "stock": 50,
        "image": "../static/images/Echeveria Blue Prince.jpg",
        "description": "This succulent forms a tight, regal rosette of dusky blue-green leaves that can take on deep purple hues under the sun. Its neat, geometric pattern makes it an ideal choice for decorative tabletop planters.",
        "care": "Provide plenty of sunlight to prevent stretching; use the 'soak and dry' method (water only when soil is bone dry); avoid getting water trapped in the leaves.",
        "cat": "Cactus"
    },
    {
        "id": 10,
        "name": "Monstera Deliciosa",
        "price": 87.00,
        "stock": 30,
        "image": "../static/images/Monstera Deliciosa.jpg",
        "description": "A bold statement piece featuring large, heart-shaped leaves with iconic natural perforations (fenestrations). This fast-growing climber brings a lush, tropical jungle feel to any modern interior.",
        "care": "Place in bright, indirect light; water once the top 2 inches of soil are dry; wipe leaves regularly to remove dust.",
        "cat": "Indoor"
    }
]

# --- ROUTES ---
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<page_name>')
def static_page(page_name):
    # Basic route to serve other HTML files
    # Security note: In prod, validate page_name against allowed list
    if page_name.endswith('.html'):
        return render_template(page_name)
    return render_template(page_name + '.html')

@app.route('/api/products')
def get_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products])

@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = flask_request.get_json()
    items = data.get('items', [])
    
    try:
        for item in items:
            product = Product.query.get(item['id'])
            if product:
                if product.stock >= item['qty']:
                    product.stock -= item['qty']
                else:
                    return jsonify({'error': f'Not enough stock for {product.name}'}), 400
        
        db.session.commit()
        return jsonify({'message': 'Order processed successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# --- INITIALIZATION ---
def init_db():
    with app.app_context():
        db.create_all()
        # Check if empty, if so seed data
        if Product.query.count() == 0:
            print("Seeding database with default products...")
            for item in initial_products:
                # Fix slight data issue in source: stock key
                stock_val = item.get('stock')
                if stock_val is None: # Handle potentially malformed key from copy-paste
                    stock_val = item.get('stock: 50', 50) 
                
                p = Product(
                    id=item['id'],
                    name=item['name'],
                    price=item['price'],
                    stock=stock_val,
                    image=item['image'],
                    description=item['description'],
                    care=item['care'],
                    cat=item['cat']
                )
                db.session.add(p)
            db.session.commit()
            print("Seeding complete.")

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
