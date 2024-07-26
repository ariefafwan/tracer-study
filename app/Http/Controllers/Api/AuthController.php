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

    public function getAuthenticatedUser(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (JWTException $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                return response()->json(['error' => 'Token is Invalid'], 403);
            } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                return response()->json(['error' => 'Token is Expired'], 403);
            } else {
                return response()->json(['error' => 'Authorization Token not found'], 403);
            }
        }

        return response()->json(['success' => 'You Are Authenticated'], 201);
    }
}
