<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Email atau Password Tidak Sesuai'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'gagal'], 500);
        }

        $datauser = JWTAuth::user();
        if ($datauser->role_id == 1 || $datauser->role_id == 2) {
            return response()->json(['error' => 'Email atau Password Tidak Sesuai'], 400);
        }

        $user = new UserResource($datauser);

        return response()->json(compact('user', 'token'));
    }

    // public function getAuthenticatedUser()
    // {
    //     try {

    //         if (!$user = JWTAuth::parseToken()->authenticate()) {
    //             return response()->json(['error' => 'user_not_found'], 404);
    //         }
    //     } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
    //         return response()->json(['error' => 'token_expired'], 500);
    //     } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

    //         return response()->json(['error' => 'token_invalid'], $e->getStatusCode());
    //     } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

    //         return response()->json(['error' => 'token_absent'], $e->getStatusCode());
    //     }

    //     return response()->json(['success' => 'You Are Authenticated'], 201);
    // }
}
