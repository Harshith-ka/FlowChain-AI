import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.supply_chain import (
    Supplier,
    Product,
    SupplierProduct,
    Facility,
    Warehouse,
    Inventory,
    TransportRoute,
    CustomerOrder,
    CustomerOrderItem,
    PurchaseOrder,
    PurchaseOrderItem,
    Shipment,
    ShipmentItem,
    FacilityType,
    TransportMode,
    OrderPriority,
    OrderStatus,
    ShipmentStatus
)

def seed_synthetic_supply_chain(db: Session, organization_id: str) -> Dict[str, Any]:
    """
    Seeds a complete, consistent 8-supplier, 3-factory, 5-warehouse, 20-product,
    50-route, 100-customer order, 30-PO, 40-shipment realistic electronics supply chain.
    """
    # Check if already seeded
    existing_count = db.query(Supplier).filter(Supplier.organization_id == organization_id).count()
    if existing_count > 0:
        return {"status": "Already seeded", "supplier_count": existing_count}

    now = datetime.now(timezone.utc)

    # 1. 20 Products
    products_data = [
        ("MCU-X8", "High-Performance 32-bit Microcontroller", "Semiconductors", 14.50, 0.05, 0.0001),
        ("RAM-32G", "DDR5 High-Density RAM Module", "Memory", 28.00, 0.08, 0.0002),
        ("DSP-AUDIO", "Low-Power Audio DSP Processor", "Semiconductors", 8.20, 0.04, 0.0001),
        ("PMIC-900", "Integrated Power Management IC", "Power", 3.40, 0.02, 0.00005),
        ("WIFI6-MOD", "Wi-Fi 6E / BT 5.3 RF Module", "Wireless", 11.00, 0.03, 0.0001),
        ("OLED-4K", "Micro-OLED Display Driver", "Displays", 35.00, 0.12, 0.0003),
        ("FLASH-128G", "128GB NVMe Flash Storage NAND", "Memory", 22.50, 0.06, 0.00015),
        ("FPGA-PRO", "Ultra-Scale Low-Latency FPGA", "Logic", 145.00, 0.15, 0.0004),
        ("CAN-TRANS", "Automotive High-Speed CAN Transceiver", "Automotive", 2.10, 0.02, 0.00005),
        ("ADC-16BIT", "16-Bit High-Speed Precision ADC", "Analog", 6.80, 0.03, 0.00008),
        ("RF-AMP", "5G Sub-6GHz Power Amplifier", "Wireless", 9.50, 0.04, 0.0001),
        ("MEMS-GYRO", "6-Axis Inertial IMU & Gyroscope", "Sensors", 4.30, 0.02, 0.00005),
        ("BLE-SOC", "Bluetooth 5.4 Low-Energy SoC", "Wireless", 3.80, 0.03, 0.00008),
        ("USB4-HUB", "USB4 / Thunderbolt 4 Controller", "Interface", 16.00, 0.05, 0.0001),
        ("ETH-PHY", "Gigabit Ethernet Physical Transceiver", "Interface", 4.10, 0.03, 0.00008),
        ("BUCK-REG", "Synchronous Step-Down DC/DC Regulator", "Power", 1.80, 0.02, 0.00005),
        ("LDO-REG", "Ultra-Low-Noise Precision LDO Regulator", "Power", 0.95, 0.01, 0.00003),
        ("MOSFET-ARRAY", "High-Current Dual N-Channel MOSFET", "Discrete", 1.20, 0.02, 0.00004),
        ("DIODE-SCHOTTKY", "Schottky Barrier Power Rectifier", "Discrete", 0.45, 0.01, 0.00002),
        ("CRYSTAL-OSC", "32.768kHz Temperature-Compensated Oscillator", "Timing", 1.10, 0.01, 0.00002),
    ]

    products: Dict[str, Product] = {}
    for sku, name, cat, cost, wt, vol in products_data:
        p = Product(
            organization_id=organization_id,
            sku=sku,
            name=name,
            category=cat,
            unit_cost=cost,
            weight_kg=wt,
            volume_m3=vol,
            is_active=True
        )
        db.add(p)
        products[sku] = p
    db.flush()

    # 2. 8 Suppliers
    suppliers_data = [
        ("SP-01", "Tokyo Micro Systems", "Japan", "Tokyo", 35.6762, 139.6503, 98.5, 4, 500, 50000, 15000, "Active", True),
        ("SP-02", "Formosa Silicon Ltd", "Taiwan", "Taipei", 25.0330, 121.5654, 96.2, 5, 1000, 80000, 20000, "Active", True),
        ("SP-03", "Seoul Semiconductor Corp", "South Korea", "Seoul", 37.5665, 126.9780, 95.0, 6, 800, 60000, 18000, "Active", True),
        ("SP-04", "Pacific Core Tech", "China", "Shenzhen", 22.5431, 114.0579, 74.0, 7, 2000, 100000, 0, "Disrupted", True),
        ("SP-05", "Bavaria Precision Electronics", "Germany", "Munich", 48.1351, 11.5820, 99.1, 3, 200, 35000, 8000, "Active", True),
        ("SP-06", "Austin Semiconductor Fab", "USA", "Austin", 30.2672, -97.7431, 97.4, 3, 500, 45000, 12000, "Active", True),
        ("SP-07", "Bangalore Chipworks", "India", "Bangalore", 12.9716, 77.5946, 92.8, 8, 1500, 70000, 16000, "Active", False),
        ("SP-08", "Penang Assembly Hub", "Malaysia", "Penang", 5.4164, 100.3327, 94.6, 5, 1000, 65000, 14000, "Active", True),
    ]

    suppliers: Dict[str, Supplier] = {}
    for code, name, country, city, lat, lon, rel, lead, moq, cap, stock, status, cert in suppliers_data:
        s = Supplier(
            organization_id=organization_id,
            code=code,
            name=name,
            country=country,
            city=city,
            latitude=lat,
            longitude=lon,
            reliability_score=rel,
            lead_time_days=lead,
            moq=moq,
            production_capacity=cap,
            available_stock=stock,
            status=status,
            is_certified=cert
        )
        db.add(s)
        suppliers[code] = s
    db.flush()

    # Link Suppliers with Products (Offerings)
    # Ensure SP-01 and SP-08 provide MCU-X8 so feasible alternatives exist!
    sp_offerings = [
        ("SP-01", "MCU-X8", 15.20, 4, 500, 20000, 5000),
        ("SP-01", "DSP-AUDIO", 8.20, 4, 500, 15000, 4000),
        ("SP-02", "RAM-32G", 27.50, 5, 1000, 30000, 8000),
        ("SP-02", "FLASH-128G", 22.00, 5, 1000, 25000, 7000),
        ("SP-03", "OLED-4K", 34.00, 6, 800, 20000, 6000),
        ("SP-04", "MCU-X8", 14.50, 7, 2000, 40000, 0),  # Disrupted
        ("SP-04", "RAM-32G", 28.00, 7, 2000, 30000, 0),  # Disrupted
        ("SP-05", "CAN-TRANS", 2.20, 3, 200, 25000, 5000),
        ("SP-06", "PMIC-900", 3.40, 3, 500, 35000, 10000),
        ("SP-07", "BLE-SOC", 3.80, 8, 1500, 30000, 8000),
        ("SP-08", "WIFI6-MOD", 10.80, 5, 1000, 25000, 6000),
        ("SP-08", "MCU-X8", 16.00, 5, 1000, 15000, 3500),  # Second feasible alternative
    ]
    for scode, psku, price, lead, moq, cap, stock in sp_offerings:
        sp = SupplierProduct(
            supplier_id=suppliers[scode].id,
            product_id=products[psku].id,
            unit_price=price,
            lead_time_days=lead,
            moq=moq,
            production_capacity=cap,
            available_stock=stock
        )
        db.add(sp)
    db.flush()

    # 3. 3 Manufacturing Facilities & 5 Warehouses & 4 Customer Clusters
    facilities_data = [
        # Factories
        ("FAC-01", "East Asia Advanced Assembly", FacilityType.MANUFACTURING.value, "China", "Shanghai", 31.2304, 121.4737, 5000.0),
        ("FAC-02", "Central European Module Plant", FacilityType.MANUFACTURING.value, "Germany", "Dresden", 51.0504, 13.7373, 6200.0),
        ("FAC-03", "North America Integration Facility", FacilityType.MANUFACTURING.value, "USA", "Austin", 30.2672, -97.7431, 5800.0),
        # Warehouses
        ("WH-01", "Central Hub Alpha", FacilityType.WAREHOUSE.value, "Singapore", "Singapore", 1.3521, 103.8198, 4500.0),
        ("WH-02", "Distribution Hub Beta", FacilityType.WAREHOUSE.value, "Netherlands", "Rotterdam", 51.9244, 4.4777, 3800.0),
        ("WH-03", "Americas Midwest DC", FacilityType.WAREHOUSE.value, "USA", "Chicago", 41.8781, -87.6298, 5200.0),
        ("WH-04", "East Asia Gateway", FacilityType.WAREHOUSE.value, "Japan", "Tokyo", 35.6762, 139.6503, 3100.0),
        ("WH-05", "DACH Logistics Center", FacilityType.WAREHOUSE.value, "Germany", "Frankfurt", 50.1109, 8.6821, 3400.0),
        # Customer Clusters
        ("CUST-NA", "North America OEM Assembly Cluster", FacilityType.CUSTOMER_DESTINATION.value, "USA", "Detroit", 42.3314, -83.0458, 500.0),
        ("CUST-EU", "EuroAuto Tier-1 Plant", FacilityType.CUSTOMER_DESTINATION.value, "Germany", "Stuttgart", 48.7758, 9.1829, 500.0),
        ("CUST-ASIA", "Asia Electronics Consortium", FacilityType.CUSTOMER_DESTINATION.value, "Japan", "Osaka", 34.6937, 135.5023, 500.0),
        ("CUST-NORD", "Nordic Medical Instruments", FacilityType.CUSTOMER_DESTINATION.value, "Sweden", "Stockholm", 59.3293, 18.0686, 500.0),
    ]

    facilities: Dict[str, Facility] = {}
    for code, name, ftype, country, city, lat, lon, cost in facilities_data:
        f = Facility(
            organization_id=organization_id,
            code=code,
            name=name,
            facility_type=ftype,
            country=country,
            city=city,
            latitude=lat,
            longitude=lon,
            operating_cost_per_day=cost
        )
        db.add(f)
        facilities[code] = f
    db.flush()

    # Create 5 Warehouse records
    warehouses_meta = [
        ("WH-01", 100000, 8000, 4500.0),
        ("WH-02", 75000, 6000, 3800.0),
        ("WH-03", 120000, 10000, 5200.0),
        ("WH-04", 50000, 4500, 3100.0),
        ("WH-05", 60000, 5000, 3400.0),
    ]
    warehouses: Dict[str, Warehouse] = {}
    for wcode, cap, hand, cost in warehouses_meta:
        wh = Warehouse(
            organization_id=organization_id,
            facility_id=facilities[wcode].id,
            storage_capacity=cap,
            handling_capacity_per_day=hand,
            operating_cost=cost,
            status="Normal"
        )
        db.add(wh)
        warehouses[wcode] = wh
    db.flush()

    # 4. Inventory positions across Warehouses
    # WH-01 has limited MCU-X8 (4200 units, 3800 reserved -> only 400 ATP!)
    # WH-02 has 8500 units of MCU-X8 in stock (Surplus for lateral transfer!)
    inventory_allocations = [
        ("WH-01", "MCU-X8", 4200, 3800, 2500, 14.50),
        ("WH-01", "RAM-32G", 2800, 2600, 1800, 28.00),
        ("WH-01", "DSP-AUDIO", 12000, 3000, 2000, 8.20),
        ("WH-02", "MCU-X8", 8500, 1500, 2000, 14.50),  # Surplus!
        ("WH-02", "RAM-32G", 6000, 1000, 1500, 28.00),
        ("WH-02", "WIFI6-MOD", 8500, 6800, 2000, 11.00),
        ("WH-03", "PMIC-900", 22000, 7500, 5000, 3.40),
        ("WH-03", "FLASH-128G", 14000, 4000, 3000, 22.50),
        ("WH-04", "DSP-AUDIO", 15400, 4200, 3000, 8.20),
        ("WH-04", "CAN-TRANS", 18000, 5000, 4000, 2.10),
        ("WH-05", "OLED-4K", 12000, 3000, 2500, 35.00),
        ("WH-05", "FPGA-PRO", 5000, 1200, 1000, 145.00),
    ]
    for wcode, psku, on_hand, reserved, safety, cost in inventory_allocations:
        inv = Inventory(
            organization_id=organization_id,
            product_id=products[psku].id,
            warehouse_id=warehouses[wcode].id,
            on_hand=on_hand,
            reserved=reserved,
            safety_stock=safety,
            unit_cost=cost,
            last_updated=now
        )
        db.add(inv)
    db.flush()

    # 5. 50 Transport Routes
    route_pairs = [
        # Inbound from Suppliers to Warehouses
        ("WH-04", "WH-01", TransportMode.AIR.value, 5300, 4.20, 1.0, 99.0, 15000),
        ("WH-04", "WH-01", TransportMode.OCEAN.value, 5300, 1.10, 8.0, 94.0, 40000),
        ("WH-01", "WH-02", TransportMode.OCEAN.value, 10500, 1.80, 18.0, 92.0, 50000),
        ("WH-01", "WH-02", TransportMode.AIR.value, 10500, 6.50, 2.0, 98.0, 12000),
        ("WH-02", "WH-05", TransportMode.ROAD.value, 450, 0.40, 0.8, 97.0, 20000),
        ("WH-02", "WH-05", TransportMode.RAIL.value, 450, 0.25, 1.2, 98.5, 30000),
        ("WH-01", "WH-03", TransportMode.AIR.value, 15000, 8.20, 2.5, 96.0, 10000),
        ("WH-03", "CUST-NA", TransportMode.ROAD.value, 480, 0.45, 0.6, 99.0, 25000),
        ("WH-02", "CUST-EU", TransportMode.ROAD.value, 600, 0.55, 0.8, 98.0, 20000),
        ("WH-05", "CUST-EU", TransportMode.ROAD.value, 200, 0.20, 0.3, 99.2, 30000),
        ("WH-04", "CUST-ASIA", TransportMode.ROAD.value, 500, 0.45, 0.7, 99.0, 25000),
        ("WH-02", "CUST-NORD", TransportMode.OCEAN.value, 1200, 0.85, 3.0, 95.0, 20000),
    ]

    routes: List[TransportRoute] = []
    # Seed routes and ensure 50 unique route pairings
    for orig_code, dest_code, mode, dist, cost, time_days, rel, cap in route_pairs:
        r = TransportRoute(
            organization_id=organization_id,
            origin_facility_id=facilities[orig_code].id,
            destination_facility_id=facilities[dest_code].id,
            transport_mode=mode,
            distance_km=dist,
            base_cost_per_unit=cost,
            transit_time_days=time_days,
            reliability_rating=rel,
            max_capacity=cap
        )
        db.add(r)
        routes.append(r)

    # Add additional multi-modal links to reach 50 routes
    for i in range(len(routes), 50):
        orig_fac = facilities[facilities_data[i % len(facilities_data)][0]]
        dest_fac = facilities[facilities_data[(i + 1) % len(facilities_data)][0]]
        if orig_fac.id != dest_fac.id:
            mode = [TransportMode.ROAD.value, TransportMode.AIR.value, TransportMode.OCEAN.value, TransportMode.RAIL.value][i % 4]
            r = TransportRoute(
                organization_id=organization_id,
                origin_facility_id=orig_fac.id,
                destination_facility_id=dest_fac.id,
                transport_mode=mode,
                distance_km=float(300 + (i * 70)),
                base_cost_per_unit=float(1.0 + (i % 5) * 0.5),
                transit_time_days=float(1.0 + (i % 4)),
                reliability_rating=95.0,
                max_capacity=15000
            )
            db.add(r)
            routes.append(r)
    db.flush()

    # 6. 100 Customer Orders (with 12 urgent orders relying on disrupted SKU MCU-X8)
    for i in range(1, 101):
        order_num = f"CO-{1000 + i}"
        is_affected = (i <= 12)
        psku = "MCU-X8" if is_affected else products_data[i % len(products_data)][0]
        cust_fac = facilities["CUST-NA"] if i % 2 == 0 else facilities["CUST-EU"]
        priority = OrderPriority.CRITICAL.value if is_affected else OrderPriority.MEDIUM.value
        due_offset = 4 if is_affected else (7 + (i % 20))
        penalty = 5000.0 if is_affected else 1000.0

        order = CustomerOrder(
            organization_id=organization_id,
            order_number=order_num,
            customer_name=f"Enterprise OEM Client #{i}",
            destination_facility_id=cust_fac.id,
            priority=priority,
            order_date=now - timedelta(days=2),
            required_delivery_date=now + timedelta(days=due_offset),
            delay_penalty_per_day=penalty,
            status=OrderStatus.DELAYED.value if is_affected else OrderStatus.PENDING.value
        )
        db.add(order)
        db.flush()

        item = CustomerOrderItem(
            customer_order_id=order.id,
            product_id=products[psku].id,
            quantity=1000 if is_affected else int(200 + (i * 30)),
            allocated_quantity=0,
            fulfilled_quantity=0,
            unit_price=products[psku].unit_cost * 1.4
        )
        db.add(item)
    db.flush()

    # 7. 30 Purchase Orders (including the disrupted PO-8801 from SP-04)
    for i in range(1, 31):
        po_num = f"PO-{8800 + i}"
        is_disrupted = (i == 1)
        supplier = suppliers["SP-04"] if is_disrupted else suppliers[suppliers_data[i % len(suppliers_data)][0]]
        wh = facilities["WH-01"]
        psku = "MCU-X8" if is_disrupted else products_data[i % len(products_data)][0]

        po = PurchaseOrder(
            organization_id=organization_id,
            po_number=po_num,
            supplier_id=supplier.id,
            destination_facility_id=wh.id,
            status=OrderStatus.DISRUPTED.value if is_disrupted else OrderStatus.IN_TRANSIT.value,
            order_date=now - timedelta(days=5),
            expected_arrival_date=now + timedelta(days=2 if not is_disrupted else 9),
            total_cost=float(products[psku].unit_cost * 10000)
        )
        db.add(po)
        db.flush()

        po_item = PurchaseOrderItem(
            purchase_order_id=po.id,
            product_id=products[psku].id,
            quantity=10000 if is_disrupted else int(1000 + i * 200),
            unit_price=products[psku].unit_cost
        )
        db.add(po_item)
    db.flush()

    # 8. 40 Shipments
    carriers = ["Maersk Line", "Flexport", "DHL Global Forwarding", "FedEx Express Cargo", "Nippon Cargo Air", "DB Schenker"]
    for i in range(1, 41):
        sh_num = f"SH-{9000 + i}"
        orig_fac = facilities["WH-01"] if i % 2 == 0 else facilities["WH-02"]
        dest_fac = facilities["CUST-NA"] if i % 2 == 0 else facilities["CUST-EU"]
        mode = [TransportMode.AIR.value, TransportMode.OCEAN.value, TransportMode.ROAD.value, TransportMode.RAIL.value][i % 4]
        is_delayed = (i == 12)

        shipment = Shipment(
            organization_id=organization_id,
            shipment_number=sh_num,
            route_id=routes[i % len(routes)].id,
            origin_facility_id=orig_fac.id,
            destination_facility_id=dest_fac.id,
            carrier=carriers[i % len(carriers)],
            transport_mode=mode,
            planned_departure=now - timedelta(days=1),
            planned_arrival=now + timedelta(days=3),
            estimated_arrival=now + timedelta(days=3 if not is_delayed else 7),
            shipment_cost=float(1200 + (i * 150)),
            status=ShipmentStatus.DELAYED.value if is_delayed else ShipmentStatus.IN_TRANSIT.value
        )
        db.add(shipment)
        db.flush()

        sh_item = ShipmentItem(
            shipment_id=shipment.id,
            product_id=products["MCU-X8"].id,
            quantity=1500
        )
        db.add(sh_item)
    
    db.commit()

    return {
        "status": "Synthetic supply chain seeded successfully",
        "suppliers": 8,
        "facilities": len(facilities),
        "warehouses": 5,
        "products": 20,
        "routes": 50,
        "customer_orders": 100,
        "purchase_orders": 30,
        "shipments": 40
    }
