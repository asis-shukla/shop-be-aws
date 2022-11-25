INSERT INTO
    carts(
        id,
        created_at,
        updated_at,
        user_id
    )
VALUES (
        '348e0f5d-7912-4170-aee9-28cf0e104ced',
        '2022-11-24',
        '2022-11-24',
        'f295f3dd-220a-46a4-a3dc-374efda865d8'
    );

INSERT INTO
    cart_items(
        cart_id,
        product_id,
        id,
        count,
        price
    )
VALUES
(
        '348e0f5d-7912-4170-aee9-28cf0e104ced',
        '48925874-9531-4280-b826-4aea971162b3',
        '3fe1033e-d4e8-4401-8b97-f4dbe9a25e38',
        4,
        200
    );