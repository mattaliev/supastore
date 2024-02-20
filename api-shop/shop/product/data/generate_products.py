from product.models import Product, ProductVariant, ProductImage
from core.models import Image

Image.objects.all().delete()
Product.objects.all().delete()
ProductVariant.objects.all().delete()

image_one = Image.objects.create(url="https://static.tildacdn.com/stor6564-3338-4363-b935-353033383234/39600854.jpg")
image_two = Image.objects.create(url="https://static.tildacdn.com/stor6237-3130-4339-b339-323861666136/26356062.jpg")

image_three = Image.objects.create(url="https://static.tildacdn.com/stor6335-3761-4535-b764-623738383565/80730659.jpg")

image_four = Image.objects.create(url="https://static.tildacdn.com/stor6361-6633-4466-a366-303339396266/14501440.jpg")

product_one = Product.objects.create(
    title="T-shirt This Is Разъеб White",
    price=100.00,
    sku="TS-001.DTC",
    quantity=10
)

product_two = Product.objects.create(
    title="Bag This Is Ditch White",
    price=80.00,
    sku="BG-001.DTC",
    quantity=20
)

product_three = Product.objects.create(
    title="T-shirt This Is Разъеб Black",
    price=100.00,
    sku="TS-002.DTC",
    quantity=10
)

ProductImage.objects.create(
    product=product_one,
    image=image_one,
    order=1
)

ProductImage.objects.create(
    product=product_one,
    image=image_two,
    order=2
)

ProductImage.objects.create(
    product=product_two,
    image=image_three,
    order=1
)

ProductImage.objects.create(
    product=product_three,
    image=image_four,
    order=1
)

ProductVariant.objects.create(
    product=product_one,
    size="S",
    quantity=10
)

ProductVariant.objects.create(
    product=product_one,
    size="M",
    quantity=10
)

ProductVariant.objects.create(
    product=product_one,
    size="L",
    quantity=10
)

ProductVariant.objects.create(
    product=product_three,
    size="S",
    quantity=10
)

ProductVariant.objects.create(
    product=product_three,
    size="M",
    quantity=10
)

ProductVariant.objects.create(
    product=product_three,
    size="L",
    quantity=10
)

