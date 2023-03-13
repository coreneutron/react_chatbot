<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::all();
        $users = $users->where('deleted', null)->values();
        if(isset($request->id)) {
            $users = $users->where('id', $request->id);
        }
        // if(isset($request->name)) {
        //     $budgets = $budgets->where('name', $request->name);
        // }
        // if(isset($request->is_house)) {
        //     $budgets = $budgets->where('is_house', $request->is_house);
        // }
        // if(isset($request->ended)) {
        //     $budgets = $budgets->where('ended', $request->ended);
        // }
        foreach ($users as $user) {
            $user['role'] = $user->roles[0]->id;
        }
		return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $user = User::create($data);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        if($request['password'])
            $request['password'] = Hash::make($request['password']);
        
        $user->update($request->all());
        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true
        ]);
    }

}
