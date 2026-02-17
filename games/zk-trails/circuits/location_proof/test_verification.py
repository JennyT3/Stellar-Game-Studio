import sys
from stellar_sdk import SorobanServer, Keypair, TransactionBuilder, Network
from stellar_sdk.xdr import SCVal

# Leer bundle hex
with open('proof_output/verification_bundle.hex', 'r') as f:
    bundle_hex = f.read().strip()

print(f"Bundle size: {len(bundle_hex)//2} bytes")
print(f"Bundle hex (first 200 chars): {bundle_hex[:200]}...")
# Aquí iría la llamada al contrato...
