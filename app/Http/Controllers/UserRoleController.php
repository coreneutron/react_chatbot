<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserRole;

class UserRoleController extends Controller
{
    public function index()
    {
        $user_roles = UserRole::all();
        $user_roles = $user_roles->where('deleted', null)->values();
        // if(isset($request->id)) {
        //     $budgets = $budgets->where('id', $request->id);
        // }
        // if(isset($request->name)) {
        //     $budgets = $budgets->where('name', $request->name);
        // }
        // if(isset($request->is_house)) {
        //     $budgets = $budgets->where('is_house', $request->is_house);
        // }
        // if(isset($request->ended)) {
        //     $budgets = $budgets->where('ended', $request->ended);
        // }
        return response()->json([
            'success' => true,
            'data' => $user_roles
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $user_role = UserRole::create($data);

        return response()->json([
            'success' => true,
            'data' => $user_role
        ]);
    }

    public function update(Request $request, UserRole $user_role)
    {
        $user_role->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $user_role
        ]);
    }

    public function destroy(UserRole $user_role)
    {
        $user_role->delete();

        return response()->json([
            'success' => true
        ]);
    }
}
