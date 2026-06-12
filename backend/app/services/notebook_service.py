from fastapi import HTTPException
from app.db.supabase_client import get_supabase


def activate_notebook(user_id: str, code: str):
    supabase = get_supabase()
    print(f"[activate] code={code!r}, user_id={user_id!r}")

    if not code.startswith("QR-"):
        raise HTTPException(status_code=400, detail="Code d'activation invalide")

    # Find notebook by activation code (service key bypasses RLS)
    result = supabase.table("notebooks").select("*").eq("activation_code", code).execute()
    print(f"[activate] found in DB: {result.data}")

    if result.data and len(result.data) > 0:
        notebook = result.data[0]
        if notebook.get("owner_id"):
            raise HTTPException(status_code=400, detail="Ce cahier est déjà activé par un autre utilisateur")
        # Notebook exists but unowned → assign to current user
        updated = supabase.table("notebooks").update({"owner_id": user_id}).eq("id", notebook["id"]).execute()
        print(f"[activate] assigned: {updated.data}")
        if updated.data and len(updated.data) > 0:
            return updated.data[0]
        return {**notebook, "owner_id": user_id}
    else:
        # Notebook not pre-seeded → create and assign
        data = {
            "owner_id": user_id,
            "name": f"Cahier {code}",
            "activation_code": code,
        }
        response = supabase.table("notebooks").insert(data).execute()
        print(f"[activate] created: {response.data}")
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise HTTPException(status_code=500, detail="Échec de la création du cahier. Vérifiez les permissions Supabase.")


def get_user_notebooks(user_id: str):
    supabase = get_supabase()
    print(f"[get_notebooks] user_id={user_id!r}")
    result = supabase.table("notebooks").select("*").eq("owner_id", user_id).execute()
    print(f"[get_notebooks] found {len(result.data or [])} notebooks")
    return result.data or []


def get_or_create_default_notebook(user_id: str):
    supabase = get_supabase()
    # Try to find existing default notebook
    result = supabase.table("notebooks").select("*").eq("owner_id", user_id).eq("name", "Mes Notes").execute()
    if result.data and len(result.data) > 0:
        print(f"[default_notebook] found existing for user {user_id}")
        return result.data[0]
    # Create one
    import uuid as _uuid
    data = {
        "owner_id": user_id,
        "name": "Mes Notes",
        "activation_code": f"AUTO-{_uuid.uuid4().hex[:8].upper()}",
    }
    response = supabase.table("notebooks").insert(data).execute()
    if response.data and len(response.data) > 0:
        print(f"[default_notebook] created for user {user_id}")
        return response.data[0]
    raise Exception("Failed to create default notebook")
